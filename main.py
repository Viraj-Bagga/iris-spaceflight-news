from typing import TypedDict
from langgraph.graph import StateGraph
import requests
from datetime import datetime, timezone, timedelta
import database
import os
from openai import OpenAI
import json
from dotenv import load_dotenv

load_dotenv()
database.init_db()

client = OpenAI(api_key=os.environ["OPENAI_API_KEY"])


class AgentState(TypedDict):
    url: list[str]
    summary: list[str]
    title: list[str]
    art_md: list[str]


def _now_iso():
    return datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")


def fetching_SNAPI(state: AgentState) -> AgentState:
    last_run = database.get_state("last_run")
    if last_run is None:
        # First run ever: only look back a short window so we don't dump a backlog
        last_run = (datetime.now(timezone.utc) - timedelta(minutes=15)).isoformat().replace("+00:00", "Z")

    run_started = _now_iso()

    response = requests.get('https://api.spaceflightnewsapi.net/v4/articles/?limit=10')
    for article in response.json()['results']:
        if article["published_at"] > last_run and not database.article_exists(article["url"]):
            state["url"].append(article["url"])
            state["title"].append(article["title"])
            database.insert_article(article["url"], article["title"], published_at=article["published_at"])

    database.set_state("last_run", run_started)
    return state


def get_md(state: AgentState) -> AgentState:
    jina_key = os.environ["JINA_API_KEY"]
    headers = {"Authorization": f"Bearer {jina_key}"}

    for target_url in state["url"]:
        request_url = f"https://r.jina.ai/{target_url}"
        try:
            response = requests.get(request_url, headers=headers, timeout=30)
            if response.status_code == 200:
                state["art_md"].append(response.text)
            else:
                print(f"Failed to fetch {target_url} (status {response.status_code})")
                state["art_md"].append("Error: Could not retrieve text.")
        except requests.RequestException as e:
            print(f"Error fetching {target_url}: {e}")
            state["art_md"].append("Error: Could not retrieve text.")

    return state


def evaluate_article(state: AgentState) -> AgentState:
    system_prompt = """
    You are an evaluator for an AFROTC detachment.
    Read the provided spaceflight news article and decide if it is highly relevant
    for the i5 squadron cadets. Relevant topics include military space applications,
    leadership, aerospace engineering, and national security.

    If it is relevant, respond in strict JSON: {"pass": true, "summary": "<a 2-3 line summary of the article>"}
    If it is not relevant, respond in strict JSON: {"pass": false}
    """

    approved_url, approved_title, approved_summary = [], [], []

    for i in range(len(state["art_md"])):
        text = state["art_md"][i]
        if text.startswith("Error:"):
            continue

        try:
            response = client.chat.completions.create(
                model="gpt-4o-mini",
                response_format={"type": "json_object"},
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": text},
                ],
            )
            result = json.loads(response.choices[0].message.content)
        except Exception as e:
            print(f"Eval failed for {state['title'][i]}: {e}")
            continue

        if result.get("pass") is True and result.get("summary", "").strip():
            summary = result["summary"].strip()
            database.update_article_summary(state["url"][i], summary)
            approved_url.append(state["url"][i])
            approved_title.append(state["title"][i])
            approved_summary.append(summary)
            print(f"Passed: {state['title'][i]}")
        else:
            print(f"Failed: {state['title'][i]}")

    state["url"], state["title"], state["summary"] = approved_url, approved_title, approved_summary
    return state


graph = StateGraph(AgentState)
graph.add_node("fetch", fetching_SNAPI)
graph.add_node("get_md", get_md)
graph.add_node("decision_model", evaluate_article)
graph.set_entry_point("fetch")
graph.add_edge("fetch", "get_md")
graph.add_edge("get_md", "decision_model")
graph.set_finish_point("decision_model")

app = graph.compile()


def run_pipeline():
    """Runs fetch -> scrape -> evaluate and returns the approved articles as dicts."""
    result = app.invoke({"url": [], "title": [], "summary": [], "art_md": []})
    return [
        {"title": t, "summary": s, "url": u}
        for t, s, u in zip(result["title"], result["summary"], result["url"])
    ]
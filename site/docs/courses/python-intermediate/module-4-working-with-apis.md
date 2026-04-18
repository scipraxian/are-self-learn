---
title: "Module 4: Working with APIs"
sidebar_position: 4
---

# Module 4: Working with APIs

## Learning Objectives

By the end of this module, you will be able to:

- Explain what a REST API is and how HTTP methods map to operations
- Use the `requests` library to make HTTP calls
- Parse JSON API responses
- Understand authentication with API tokens
- Interact with Are-Self's DRF ViewSet endpoints
- Handle API errors and pagination

## What Is an API?

An API (Application Programming Interface) is a contract between two pieces of software: "Send me a request in this format, and I will send you a response in that format."

A REST API uses HTTP — the same protocol your browser uses to load web pages. The difference is that instead of HTML, it returns structured data (usually JSON).

## HTTP Methods

REST APIs use HTTP methods to indicate what operation to perform:

| Method | Purpose | Example |
|--------|---------|---------|
| `GET` | Retrieve data | Get a list of Engrams |
| `POST` | Create new data | Store a new Engram |
| `PUT` | Replace existing data | Replace an Engram entirely |
| `PATCH` | Update part of existing data | Update an Engram's relevance score |
| `DELETE` | Remove data | Delete an Engram |

## The `requests` Library

Python's `requests` library makes HTTP calls straightforward:

```python
import requests

# GET request — retrieve data
response = requests.get("http://localhost:8000/api/hippocampus/engrams/")

print(response.status_code)  # 200 means success
print(response.json())       # Parse the JSON response into a Python dict
```

### Making Different Types of Requests

```python
# GET — list all engrams
response = requests.get(
    "http://localhost:8000/api/hippocampus/engrams/",
    headers={"Authorization": "Token your-api-token-here"}
)

# GET — retrieve a specific engram by ID
response = requests.get(
    "http://localhost:8000/api/hippocampus/engrams/uuid-1234-5678/",
    headers={"Authorization": "Token your-api-token-here"}
)

# POST — create a new engram
response = requests.post(
    "http://localhost:8000/api/hippocampus/engrams/",
    headers={"Authorization": "Token your-api-token-here"},
    json={
        "name": "New memory",
        "description": "Something important to remember",
        "relevance_score": 0.85,
    }
)

# PATCH — update a specific field
response = requests.patch(
    "http://localhost:8000/api/hippocampus/engrams/uuid-1234-5678/",
    headers={"Authorization": "Token your-api-token-here"},
    json={"relevance_score": 0.95}
)

# DELETE — remove an engram
response = requests.delete(
    "http://localhost:8000/api/hippocampus/engrams/uuid-1234-5678/",
    headers={"Authorization": "Token your-api-token-here"}
)
```

## Status Codes

The server's response includes a status code that tells you what happened:

| Code | Meaning |
|------|---------|
| `200` | OK — request succeeded |
| `201` | Created — new resource was created |
| `204` | No Content — success, but nothing to return (common for DELETE) |
| `400` | Bad Request — your data was invalid |
| `401` | Unauthorized — missing or invalid authentication |
| `403` | Forbidden — authenticated but not allowed |
| `404` | Not Found — the resource does not exist |
| `500` | Internal Server Error — something broke on the server |

```python
response = requests.get("http://localhost:8000/api/hippocampus/engrams/")

if response.status_code == 200:
    data = response.json()
    print(f"Retrieved {len(data['results'])} engrams.")
elif response.status_code == 401:
    print("Authentication required. Check your API token.")
elif response.status_code == 404:
    print("Endpoint not found. Check the URL.")
else:
    print(f"Unexpected status: {response.status_code}")
```

## Are-Self Connection: DRF ViewSets

Are-Self uses Django REST Framework (DRF) to expose its models as API endpoints. Each brain region has ViewSets that provide standard CRUD operations.

The URL structure follows a pattern:

```
/api/{brain_region}/{model_name}/              — List / Create
/api/{brain_region}/{model_name}/{id}/         — Retrieve / Update / Delete
```

For example:
```
/api/hippocampus/engrams/                      — List all engrams
/api/hippocampus/engrams/{uuid}/               — Single engram
/api/frontal-lobe/neural-pathways/             — List all pathways
/api/frontal-lobe/neurons/                     — List all neurons
/api/identity/identity-discs/                  — List all identity discs
/api/hypothalamus/model-configs/               — List model configurations
```

### Light and Full Serializers

Are-Self uses two serializer variants for each model:

- **Light serializer** — returned in list views, includes only essential fields (id, name, key attributes)
- **Full serializer** — returned in detail views, includes all fields plus related objects

```python
# Light response (list view)
response = requests.get("http://localhost:8000/api/hippocampus/engrams/")
# Each item has: id, name, relevance_score, is_active, created_at

# Full response (detail view)
response = requests.get("http://localhost:8000/api/hippocampus/engrams/uuid-1234/")
# Full item has: everything above PLUS description, hash, tags, embedding, modified_at, delta
```

This is a common optimization — list views that return hundreds of items use the light serializer to reduce payload size. Only when you request a specific item do you get the full data.

### Filtering

Are-Self uses DjangoFilterBackend, which means you can filter results using query parameters:

```python
# Filter engrams by relevance score
response = requests.get(
    "http://localhost:8000/api/hippocampus/engrams/",
    params={"relevance_score__gte": 0.8}
)

# Filter by active status
response = requests.get(
    "http://localhost:8000/api/hippocampus/engrams/",
    params={"is_active": True}
)

# Search by name
response = requests.get(
    "http://localhost:8000/api/hippocampus/engrams/",
    params={"search": "reasoning"}
)
```

## Handling Pagination

Are-Self paginates list responses (default: 25 items per page):

```python
def get_all_engrams(base_url, token):
    """Retrieve all engrams, handling pagination."""
    headers = {"Authorization": f"Token {token}"}
    all_engrams = []
    url = f"{base_url}/api/hippocampus/engrams/"
    
    while url:
        response = requests.get(url, headers=headers)
        response.raise_for_status()  # Raises exception for 4xx/5xx
        data = response.json()
        
        all_engrams.extend(data["results"])
        url = data.get("next")  # URL to the next page, or None
    
    return all_engrams
```

The paginated response looks like:

```json
{
    "count": 142,
    "next": "http://localhost:8000/api/hippocampus/engrams/?page=2",
    "previous": null,
    "results": [
        {"id": "...", "name": "...", "relevance_score": 0.95},
        {"id": "...", "name": "...", "relevance_score": 0.88}
    ]
}
```

## Building an API Client

Wrap your API interactions in a clean client class:

```python
class AreSelfClient:
    """Client for interacting with the Are-Self API."""
    
    def __init__(self, base_url, token):
        self.base_url = base_url.rstrip("/")
        self.session = requests.Session()
        self.session.headers["Authorization"] = f"Token {token}"
    
    def _url(self, path):
        return f"{self.base_url}{path}"
    
    def list_engrams(self, min_relevance=None, is_active=None):
        """List engrams with optional filters."""
        params = {}
        if min_relevance is not None:
            params["relevance_score__gte"] = min_relevance
        if is_active is not None:
            params["is_active"] = is_active
        
        response = self.session.get(
            self._url("/api/hippocampus/engrams/"), params=params
        )
        response.raise_for_status()
        return response.json()["results"]
    
    def get_engram(self, engram_id):
        """Retrieve a single engram by ID."""
        response = self.session.get(
            self._url(f"/api/hippocampus/engrams/{engram_id}/")
        )
        response.raise_for_status()
        return response.json()
    
    def create_engram(self, name, description="", relevance_score=0.0):
        """Create a new engram."""
        response = self.session.post(
            self._url("/api/hippocampus/engrams/"),
            json={
                "name": name,
                "description": description,
                "relevance_score": relevance_score,
            }
        )
        response.raise_for_status()
        return response.json()
    
    def list_pathways(self):
        """List all neural pathways."""
        response = self.session.get(
            self._url("/api/frontal-lobe/neural-pathways/")
        )
        response.raise_for_status()
        return response.json()["results"]
```

Usage:

```python
client = AreSelfClient("http://localhost:8000", "your-token")

# List high-relevance engrams
engrams = client.list_engrams(min_relevance=0.8)
for e in engrams:
    print(f"  {e['name']}: {e['relevance_score']}")

# Create a new memory
new = client.create_engram(
    "API interaction pattern learned",
    description="The user learned how to call REST APIs with Python",
    relevance_score=0.75
)
print(f"Created: {new['id']}")
```

## Exercises

### Exercise 1: Engram Explorer

Write a script that uses the `AreSelfClient` class to:
1. List all engrams
2. Find the one with the highest relevance score
3. Retrieve its full details
4. Print a formatted report

(If you do not have a running Are-Self instance, mock the responses using dictionaries.)

### Exercise 2: Bulk Operations

Write a function `bulk_update_relevance(client, engram_ids, new_score)` that:
- Takes a list of engram IDs and a new relevance score
- Updates each one via PATCH
- Handles errors for individual items without stopping the batch
- Returns a report of successes and failures

### Exercise 3: API Health Checker

Write a function that checks the health of Are-Self's API:
- Try to reach each brain region's list endpoint
- Record the status code and response time for each
- Report which endpoints are healthy, slow (> 2s), or unreachable

### Exercise 4: Search and Archive

Write a script that:
1. Searches for engrams with relevance below 0.2
2. Saves them to a JSON file as an archive
3. Deletes them from the system (with a confirmation prompt)
4. Reports how many were archived and deleted

### Exercise 5: Pathway Visualizer

Write a script that:
1. Retrieves all neural pathways
2. For each pathway, retrieves its neurons and axons
3. Prints a text-based visualization showing the flow

```
query_processing:
  [Receive Query] --flow--> [Analyze Intent]
  [Analyze Intent] --success--> [Retrieve Memory]
  [Analyze Intent] --failure--> [Error Handler]
  [Retrieve Memory] --flow--> [Generate Response]
```

## Reflection

APIs are about the Variable of **Inquiry** — you ask a question (send a request) and receive an answer (get a response). But they are also about **Responsibility**. When you call an API, you are interacting with a system that other people depend on. Send too many requests, and you overload it. Send malformed data, and you corrupt it. Handle errors poorly, and you miss important information.

The `AreSelfClient` class is a model of responsible interaction: it wraps raw HTTP calls in meaningful methods, handles errors, and presents a clean interface. This is what good code does — it takes something complex and makes it approachable without hiding the important details.

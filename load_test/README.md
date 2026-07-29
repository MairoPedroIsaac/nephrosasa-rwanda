# Vitals API Load Test

This is a standalone, lightweight load/latency test for the NephroSasa Rwanda DRF backend. It sends concurrent POST requests to the `/api/vitals/log/` endpoint using `httpx` and `asyncio`.

## Requirements
- Python 3.8+
- The backend server running locally on `http://localhost:8000`

## Setup

1. (Optional) Create and activate a new virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements-loadtest.txt
   ```
3. Update the credentials in `load_test.py`:
   Open `load_test.py` and replace `EMAIL` and `PASSWORD` with the credentials of an existing test patient account that exists on your local database/Supabase instance.

## Running the Test

```bash
python load_test.py
```

## Interpreting the Results

The script runs three separate batches of concurrent requests (10, 25, and 50) and outputs a summary table:
- **Concurrent Reqs**: The number of requests sent simultaneously in the batch.
- **Avg Time (s)**: The average response time across all requests in the batch.
- **p95 Time (s)**: The 95th percentile response time (95% of requests completed faster than this time). This is a standard metric for measuring latency tail-end performance.
- **Error Rate**: The percentage of requests that did not return a 2xx status code.
- **Total Time (s)**: The total wall-clock time it took for the entire batch to complete.

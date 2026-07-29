import asyncio
import httpx
import time
import statistics
import logging

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

BASE_URL = "http://127.0.0.1:8000/api"
LOGIN_URL = f"{BASE_URL}/auth/login/"
VITALS_URL = f"{BASE_URL}/vitals/log/"
EMAIL = "profitheist2@gmail.com"
PASSWORD = "CREATIVE2000"

SAMPLE_PAYLOAD = {
    "systolic_bp": 120,
    "diastolic_bp": 80,
    "blood_sugar": 90,
    "hba1c": 5.5,
    "creatinine": 1.0,
    "gfr": 90.0,
    "bun": 15.0
}

async def get_auth_token():
    async with httpx.AsyncClient() as client:
        response = await client.post(LOGIN_URL, json={"email": EMAIL, "password": PASSWORD})
        if response.status_code == 200:
            return response.json().get("access")
        else:
            logging.error(f"Failed to authenticate. Status: {response.status_code}, Response: {response.text}")
            raise Exception("Authentication failed")

async def send_request(client, token):
    headers = {"Authorization": f"Bearer {token}"}
    start_time = time.perf_counter()
    response = await client.post(VITALS_URL, json=SAMPLE_PAYLOAD, headers=headers)
    end_time = time.perf_counter()
    return response.status_code, end_time - start_time

async def run_batch(token, num_requests):
    async with httpx.AsyncClient(timeout=30.0) as client:
        tasks = [send_request(client, token) for _ in range(num_requests)]
        batch_start_time = time.perf_counter()
        results = await asyncio.gather(*tasks)
        batch_end_time = time.perf_counter()
        
    return results, batch_end_time - batch_start_time

async def main():
    try:
        logging.info("Obtaining JWT token...")
        token = await get_auth_token()
        logging.info("Token obtained successfully.")
    except Exception as e:
        logging.error(f"Exiting due to authentication error: {e}")
        return

    batches = [10, 25, 50]
    
    print("\n" + "="*75)
    print("LOAD TEST SUMMARY")
    print("="*75)
    print(f"{'Concurrent Reqs':<18} | {'Avg Time (s)':<12} | {'p95 Time (s)':<12} | {'Error Rate':<12} | {'Total Time (s)'}")
    print("-" * 75)
    
    for batch_size in batches:
        logging.info(f"Running batch of {batch_size} concurrent requests...")
        results, batch_duration = await run_batch(token, batch_size)
        
        times = [t for status, t in results]
        errors = [status for status, t in results if not (200 <= status < 300)]
        
        avg_time = statistics.mean(times) if times else 0
        p95_time = statistics.quantiles(times, n=20)[18] if len(times) > 1 else times[0]
        error_rate = (len(errors) / batch_size) * 100
        
        print(f"{batch_size:<18} | {avg_time:<12.4f} | {p95_time:<12.4f} | {error_rate:>9.1f}%   | {batch_duration:.4f}")
        
        # Small sleep between batches to let the server recover
        await asyncio.sleep(2)

    print("=" * 75 + "\n")

if __name__ == "__main__":
    asyncio.run(main())

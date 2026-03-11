from playwright.sync_api import sync_playwright
import time
import os

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()

    # Capture console logs
    page.on("console", lambda msg: print(f"Browser console: {msg.text}"))
    page.on("pageerror", lambda err: print(f"Browser error: {err}"))

    page.goto("http://localhost:5175/")
    time.sleep(2)
    page.screenshot(path="/home/jules/verification/dark_welcome2.png")

    browser.close()

from playwright.sync_api import sync_playwright, expect
import time
import os

os.makedirs("/home/jules/verification", exist_ok=True)

def verify_undo_redo():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={'width': 1280, 'height': 800})
        page = context.new_page()

        try:
            print("Navigating to http://localhost:5174/")
            page.goto("http://localhost:5174/", wait_until="networkidle")

            # 1. Start editing
            print("Clicking Start Editing...")
            page.get_by_role("button", name="Start Editing").click()

            # Wait for canvas to be ready
            page.wait_for_selector("canvas", state="visible")
            time.sleep(2) # Give canvas and fabric.js time to initialize image

            # 2. Go to adjustments and change brightness
            print("Changing brightness slider...")
            brightness_slider = page.locator("input[type='range']").first
            brightness_slider.fill("50")
            # Dispatch event to trigger onChange
            brightness_slider.evaluate("el => { el.dispatchEvent(new Event('input', { bubbles: true })); el.dispatchEvent(new Event('change', { bubbles: true })); }")

            time.sleep(1) # wait for fabric to apply filter and save history

            # Take screenshot before undo
            page.screenshot(path="/home/jules/verification/before_undo.png")
            print("Took before_undo.png")

            # 3. Click Undo
            print("Clicking Undo...")
            undo_button = page.get_by_title("Undo").first
            undo_button.click()

            time.sleep(1) # Wait for undo to apply and store to sync

            # Verify slider is back to 0
            # Playwright fill/evaluate might not visually update the slider thumb immediately in a headless browser,
            # but we can check the value property or take a screenshot.
            brightness_value = brightness_slider.evaluate("el => el.value")
            print(f"Brightness slider value after undo: {brightness_value}")

            page.screenshot(path="/home/jules/verification/after_undo.png")
            print("Took after_undo.png")

            # 4. Click Redo
            print("Clicking Redo...")
            redo_button = page.get_by_title("Redo").first
            redo_button.click()

            time.sleep(1) # Wait for redo

            brightness_value2 = brightness_slider.evaluate("el => el.value")
            print(f"Brightness slider value after redo: {brightness_value2}")

            page.screenshot(path="/home/jules/verification/after_redo.png")
            print("Took after_redo.png")

        except Exception as e:
            print(f"Error during test: {e}")
            page.screenshot(path="/home/jules/verification/error.png")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_undo_redo()

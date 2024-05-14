const fs = require("fs");
const path = require("path");
const { ipcRenderer } = require("electron");
const jsonFilePath = path.join(__dirname, "../backend/clipboard.json");

document.addEventListener("DOMContentLoaded", () => {
    document.addEventListener("mousemove", (event) => {
        if (event.clientY < 10) {
            ipcRenderer.send("show-menu");
        } else {
            ipcRenderer.send("hide-menu");
        }
    });
});

// Function to render JSON data
function renderJSON(data) {
    const jsonData = JSON.parse(data);
    const container = document.getElementById("json-container");
    container.innerHTML = ""; // Clear previous content

    // Get the keys of JSON data in reverse order
    const keys = Object.keys(jsonData).reverse();

    // Loop through each object in the JSON data in reverse order
    for (let key of keys) {
        if (jsonData.hasOwnProperty(key)) {
            // Extract the "name" field from the object
            const item = jsonData[key].item;
            const content = JSON.stringify(jsonData[key], null, 2); // Content to copy

            // Create a new box container for each object
            const boxContainer = document.createElement("div");
            boxContainer.className = "json-box-container";

            // Create a new box for each object
            const box = document.createElement("div");
            box.className = "json-box";

            // Create a heading for the object
            const heading = document.createElement("p");
            heading.textContent = item;
            box.appendChild(heading);

            // Attach onClick event listener to the box
            box.addEventListener("click", () => {
                // Copy content to clipboard
                const copyContent = () => {
                    navigator.clipboard
                        .writeText(item)
                        .then(() => {
                            console.log(
                                "Content copied to clipboard:",
                                content
                            );
                        })
                        .catch((err) => {
                            console.error(
                                "Failed to copy content to clipboard:",
                                err
                            );
                        });
                };

                // Check if the document is focused, if not, focus it
                if (!document.hasFocus()) {
                    window.focus();
                    // Wait for a short delay to ensure the document is focused before copying content
                    setTimeout(() => {
                        copyContent();
                    }, 100);
                } else {
                    // If document is already focused, directly copy content
                    copyContent();
                }

                // Add animation class to box container
                boxContainer.classList.add("animated");

                // Remove animation class after animation completes
                setTimeout(() => {
                    boxContainer.classList.remove("animated");
                }, 1000); // Adjust timing as needed
            });

            // Append the box to the container
            boxContainer.appendChild(box);

            // Append the box container to the main container
            container.appendChild(boxContainer);
        }
    }
}

// Initial render
fs.readFile(jsonFilePath, "utf8", (err, data) => {
    if (err) {
        console.error(err);
        return;
    }
    renderJSON(data);
});

// Watch for changes to the file and re-render
fs.watchFile(jsonFilePath, (curr, prev) => {
    fs.readFile(jsonFilePath, "utf8", (err, data) => {
        if (err) {
            console.error(err);
            return;
        }
        renderJSON(data);
    });
});

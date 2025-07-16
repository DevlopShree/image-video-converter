document.getElementById("uploadArea").addEventListener("dragover", function(event) {
    event.preventDefault();
    this.style.borderColor = "#28a745";
});

document.getElementById("uploadArea").addEventListener("dragleave", function(event) {
    this.style.borderColor = "#aaa";
});

document.getElementById("uploadArea").addEventListener("drop", function(event) {
    event.preventDefault();
    this.style.borderColor = "#aaa";
    document.getElementById("fileInput").files = event.dataTransfer.files;
});

document.getElementById("themeToggle").addEventListener("click", function() {
    document.body.classList.toggle("dark-mode");
    this.textContent = document.body.classList.contains("dark-mode") ? "☀️ Light Mode" : "🌙 Dark Mode";
});

function convertFiles() {
    const files = document.getElementById("fileInput").files;
    const format = document.getElementById("format").value;
    if (files.length === 0) {
        alert("Please select at least one file.");
        return;
    }
    
    document.getElementById("loading").style.display = "block";
    document.getElementById("output").innerHTML = "";
    
    Array.from(files).forEach(file => {
        if (file.type.startsWith("image")) {
            convertImage(file, format);
        } else if (file.type.startsWith("video") && format === "gif") {
            convertVideoToGif(file);
        } else {
            alert("Unsupported conversion format");
        }
    });
}

function convertImage(file, format) {
    const reader = new FileReader();
    reader.onload = function(event) {
        const img = new Image();
        img.onload = function() {
            const canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0);
            
            const convertedUrl = canvas.toDataURL(`image/${format}`, 0.8);
            createDownloadLink(convertedUrl, file.name, format);
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
}

function createDownloadLink(url, filename, format) {
    const downloadLink = document.createElement("a");
    downloadLink.href = url;
    downloadLink.download = filename.replace(/\.[^.]+$/, `.${format}`);
    downloadLink.textContent = `Download ${filename.replace(/\.[^.]+$/, `.${format}`)}`;
    document.getElementById("output").appendChild(downloadLink);
    document.getElementById("output").appendChild(document.createElement("br"));
    document.getElementById("loading").style.display = "none";
}

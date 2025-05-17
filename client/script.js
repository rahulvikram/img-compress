document.getElementById('uploadForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const file = document.getElementById('imageInput').files[0];

    // Verify file is an image
    if (!file.type.startsWith('image/')) {
        alert('Error: File must be an image.');
        return;
    }

    // Verify file is less than 10MB
    const fileSizeInMB = (file.size / (1024 * 1024)).toFixed(2);
    if (fileSizeInMB > 10) {
        alert('Error: Image must be less than 10MB.');
        return;
    }
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch('http://localhost:3000/compress', {
            method: 'POST',
            body: formData
        });
        
        if (!response.ok) {
            throw new Error('Failed to upload image');
        }

        const data = await response.json();
        const compressedFile = data.compressedFile;
        
        // Create an image element to get metadata
        const img = new Image();
        img.src = compressedFile;
        
        img.onload = () => {
            // Calculate compression ratio
            const compressionRatio = ((data.originalSize - data.compressedSize) / data.originalSize * 100).toFixed(2);
            document.getElementById('result').innerHTML = `
                <div class="image-container">
                    <img src="${compressedFile}" alt="Compressed Image" style="max-width: 100%; height: auto;">
                </div>
                <div class="metadata">
                    <h3>Image Metadata:</h3>
                    <p>Original size: ${(data.originalSize / (1024 * 1024)).toFixed(2)} MB</p>
                    <p>Compressed size: ${(data.compressedSize / (1024 * 1024)).toFixed(2)} MB</p>
                    <p>Compression ratio: ${compressionRatio}%</p>
                    <p>Dimensions: ${img.width} x ${img.height} pixels</p>
                    <p>Format: ${file.type}</p>
                </div>
            `;
        };

        img.onerror = () => {
            document.getElementById('result').innerHTML = `
                <p>Error: Failed to load compressed image</p>
            `;
        };

    } catch (error) {
        console.error('Error:', error);
        document.getElementById('result').innerHTML = `
            <p>Error: ${error.message}</p>
        `;
    }
});


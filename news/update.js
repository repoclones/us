
    document.addEventListener("DOMContentLoaded", function() {
        fetch('newsmap.json')
            .then(response => response.json())
            .then(data => {
                const ticker = document.getElementById('ticker01');
                const lastNineItems = data.slice(-9).reverse(); // Get the last 9 items and reverse them to maintain order

                lastNineItems.forEach(item => {
                    const li = document.createElement('li');
                    const a = document.createElement('a');
                    a.href = item.Href;

                    const img = document.createElement('img');
                    img.src = item.Image;
                    img.style.width = '20px';
                    img.style.height = '20px';
                    img.alt = '';

                    const text = document.createTextNode(item.Title);

                    a.appendChild(img);
                    a.appendChild(text);
                    li.appendChild(a);
                    ticker.appendChild(li);
                });
            })
            .catch(error => console.error('Error fetching news data:', error));
    });

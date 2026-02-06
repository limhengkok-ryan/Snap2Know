const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.post('/clarifai-proxy', async (req, res) => {
    const {
        CLARIFAI_PAT,
        CLARIFAI_USER_ID,
        CLARIFAI_APP_ID
    } = process.env;
    const MODEL_ID = 'general-image-recognition';

    if (!CLARIFAI_PAT || !CLARIFAI_USER_ID || !CLARIFAI_APP_ID) {
        return res.status(500).json({
            error: 'Clarifai credentials not configured on the server.'
        });
    }

    const {
        imageData
    } = req.body;

    if (!imageData) {
        return res.status(400).json({
            error: 'Image data is required.'
        });
    }

    const raw = JSON.stringify({
        "user_app_id": {
            "user_id": CLARIFAI_USER_ID,
            "app_id": CLARIFAI_APP_ID
        },
        "inputs": [{
            "data": {
                "image": {
                    "base64": imageData
                }
            }
        }]
    });

    const requestOptions = {
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Key ' + CLARIFAI_PAT
        }
    };

    try {
        const response = await axios.post(`https://api.clarifai.com/v2/models/${MODEL_ID}/outputs`, raw, requestOptions);
        res.json(response.data);
    } catch (error) {
        console.error('Clarifai API Error:', error.response ? error.response.data : error.message);
        res.status(500).json({
            error: 'Failed to fetch data from Clarifai API.'
        });
    }
});

app.get('/image-proxy', async (req, res) => {
  const { url } = req.query;
  if (!url) {
    return res.status(400).send('Image URL is required');
  }

  try {
    const response = await axios({
      method: 'get',
      url: url,
      responseType: 'stream',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36'
      }
    });
    response.data.pipe(res);
  } catch (error) {
    console.error('Image proxy error:', error);
    res.status(500).send('Failed to fetch image');
  }
});

app.listen(port, () => {
    console.log(`Proxy server listening at http://localhost:${port}`);
});

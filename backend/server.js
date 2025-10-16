const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const products = [
  { id: 1, name: 'iPhone 14', category: 'Phone', price: 799, specs: '6.1-inch display, A15 Bionic chip, 128GB' },
  { id: 2, name: 'Samsung Galaxy S23', category: 'Phone', price: 699, specs: '6.1-inch display, Snapdragon 8 Gen 2, 128GB' },
  { id: 3, name: 'Google Pixel 7', category: 'Phone', price: 599, specs: '6.3-inch display, Google Tensor G2, 128GB' },
  { id: 4, name: 'OnePlus 11', category: 'Phone', price: 699, specs: '6.7-inch display, Snapdragon 8 Gen 2, 128GB' },
  { id: 5, name: 'Motorola Edge 40', category: 'Phone', price: 449, specs: '6.55-inch display, Dimensity 8020, 256GB' },
  { id: 6, name: 'iPhone SE', category: 'Phone', price: 429, specs: '4.7-inch display, A15 Bionic chip, 64GB' },
  { id: 7, name: 'Samsung Galaxy A54', category: 'Phone', price: 449, specs: '6.4-inch display, Exynos 1380, 128GB' },
  { id: 8, name: 'MacBook Air M2', category: 'Laptop', price: 1199, specs: '13.6-inch display, M2 chip, 8GB RAM, 256GB SSD' },
  { id: 9, name: 'Dell XPS 13', category: 'Laptop', price: 999, specs: '13.4-inch display, Intel i7, 16GB RAM, 512GB SSD' },
  { id: 10, name: 'HP Pavilion 15', category: 'Laptop', price: 649, specs: '15.6-inch display, Intel i5, 8GB RAM, 256GB SSD' },
  { id: 11, name: 'Lenovo ThinkPad E14', category: 'Laptop', price: 749, specs: '14-inch display, AMD Ryzen 5, 8GB RAM, 256GB SSD' },
  { id: 12, name: 'ASUS VivoBook 15', category: 'Laptop', price: 549, specs: '15.6-inch display, Intel i5, 8GB RAM, 512GB SSD' },
  { id: 13, name: 'iPad Air', category: 'Tablet', price: 599, specs: '10.9-inch display, M1 chip, 64GB' },
  { id: 14, name: 'Samsung Galaxy Tab S8', category: 'Tablet', price: 699, specs: '11-inch display, Snapdragon 8 Gen 1, 128GB' },
  { id: 15, name: 'Amazon Fire HD 10', category: 'Tablet', price: 149, specs: '10.1-inch display, MediaTek MT8183, 32GB' },
  { id: 16, name: 'Sony WH-1000XM5', category: 'Headphones', price: 399, specs: 'Noise cancelling, 30hr battery, Bluetooth 5.2' },
  { id: 17, name: 'AirPods Pro', category: 'Headphones', price: 249, specs: 'Active noise cancelling, 6hr battery, Spatial audio' },
  { id: 18, name: 'JBL Tune 760NC', category: 'Headphones', price: 129, specs: 'Noise cancelling, 35hr battery, Bluetooth 5.0' },
  { id: 19, name: 'Apple Watch Series 9', category: 'Smartwatch', price: 399, specs: 'Always-on display, Health sensors, GPS' },
  { id: 20, name: 'Samsung Galaxy Watch 6', category: 'Smartwatch', price: 299, specs: 'AMOLED display, Health tracking, GPS' }
];

app.get('/api/products', (req, res) => {
  res.json(products);
});

app.post('/api/recommend', async (req, res) => {
  try {
    const { userInput } = req.body;

    if (!userInput) {
      return res.status(400).json({ error: 'User input is required' });
    }

    const prompt = `You are a strict product recommendation system. You must ONLY recommend products that EXACTLY match the user's requirements.

AVAILABLE PRODUCTS DATABASE:
${products.map(p => `ID: ${p.id} | Name: ${p.name} | Category: ${p.category} | Price: $${p.price} | Specs: ${p.specs}`).join('\n')}

USER REQUEST: "${userInput}"

STRICT RULES:
1. If user asks for "headphones", "earphones", "earbuds", "airpods", or "audio", ONLY return IDs: 16, 17, 18 (ALL THREE)
2. If user asks for "tablet" or "tablets", ONLY return IDs: 13, 14, 15 (NEVER phones)
3. If user asks for "phone" or "mobile", ONLY return IDs from: 1, 2, 3, 4, 5, 6, 7
4. If user asks for "laptop", ONLY return IDs from: 8, 9, 10, 11, 12
5. If user asks for "watch" or "smartwatch", ONLY return IDs: 19, 20
6. Filter by price if user mentions budget (e.g., "under $500" means price <= 500)
7. If user mentions features (e.g., "noise cancelling"), prioritize products with those features BUT stay in same category
8. Return 3-5 most relevant product IDs from the CORRECT category
9. NEVER mix categories - if they ask for headphones, DO NOT include watches, phones, or anything else

RESPONSE FORMAT:
You must respond with ONLY a JSON array of product IDs that match ALL criteria.
Example: [13, 14, 15]

Do not include ANY text, explanations, or markdown. Just the JSON array.

YOUR RESPONSE:`;

    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.0-flash',
      generationConfig: {
        temperature: 0.1, 
        topP: 0.8,
        topK: 20,
      }
    });
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text().trim();

    console.log('AI Response:', text);

    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    let recommendedIds = [];
    try {
      recommendedIds = JSON.parse(text);
      
      recommendedIds = recommendedIds.filter(id => 
        products.some(p => p.id === id)
      );
    } catch (parseError) {
      console.error('Parse error:', parseError);
      
      const matches = text.match(/\d+/g);
      if (matches) {
        recommendedIds = matches.map(Number).filter(id => 
          products.some(p => p.id === id)
        );
      }
    }

    const lowerInput = userInput.toLowerCase();
    let expectedCategory = null;
    
    if (lowerInput.includes('headphone') || lowerInput.includes('earphone') || 
        lowerInput.includes('airpod') || lowerInput.includes('earbud') || 
        lowerInput.includes('headset') || lowerInput.includes('audio')) {
      expectedCategory = 'Headphones';
    }
    else if (lowerInput.includes('tablet')) expectedCategory = 'Tablet';
    else if (lowerInput.includes('phone') || lowerInput.includes('mobile')) expectedCategory = 'Phone';
    else if (lowerInput.includes('laptop')) expectedCategory = 'Laptop';
    else if (lowerInput.includes('watch')) expectedCategory = 'Smartwatch';

    if (expectedCategory) {
      const categoryProducts = products.filter(p => p.category === expectedCategory);
      recommendedIds = recommendedIds.filter(id => 
        categoryProducts.some(p => p.id === id)
      );
      
      if (recommendedIds.length === 0) {
        let fallbackProducts = categoryProducts;
        
        const priceMatch = userInput.match(/under\s+\$?(\d+)/i) || userInput.match(/below\s+\$?(\d+)/i);
        if (priceMatch) {
          const maxPrice = parseInt(priceMatch[1]);
          fallbackProducts = fallbackProducts.filter(p => p.price <= maxPrice);
        }
        
        if (lowerInput.includes('noise cancel')) {
          fallbackProducts = fallbackProducts.filter(p => 
            p.specs.toLowerCase().includes('noise cancel')
          );
        }
        
        if (expectedCategory === 'Headphones' && fallbackProducts.length >= 3) {
          recommendedIds = fallbackProducts.map(p => p.id);
        } else {
          recommendedIds = fallbackProducts.slice(0, 5).map(p => p.id);
        }
      }
    }

    const recommendedProducts = products.filter(p => recommendedIds.includes(p.id));

    if (recommendedProducts.length === 0) {
      let fallbackProducts = products;
      
      if (expectedCategory) {
        fallbackProducts = products.filter(p => p.category === expectedCategory);
      }
      
      const priceMatch = userInput.match(/under\s+\$?(\d+)/i) || userInput.match(/below\s+\$?(\d+)/i);
      if (priceMatch) {
        const maxPrice = parseInt(priceMatch[1]);
        fallbackProducts = fallbackProducts.filter(p => p.price <= maxPrice);
      }
      
      return res.json({
        products: fallbackProducts.slice(0, 5),
        message: `Found ${fallbackProducts.length} products matching your criteria:`,
        aiResponse: text
      });
    }

    res.json({
      products: recommendedProducts,
      message: `Found ${recommendedProducts.length} ${expectedCategory ? expectedCategory.toLowerCase() + '(s)' : 'product(s)'} matching your requirements:`,
      aiResponse: text
    });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      error: 'Failed to get recommendations',
      details: error.message 
    });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
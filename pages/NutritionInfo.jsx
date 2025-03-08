
import React, { useState } from 'react';
import axios from 'axios';
import './NutritionInfo.css'; // Import the CSS file

const NutritionInfo = () => {
    const [query, setQuery] = useState('');
    const [nutritionData, setNutritionData] = useState(null);

    const handleSearch = async () => {
        try {
            const response = await axios.post('http://localhost:5005/api/nutrition', { query });
            setNutritionData(response.data.nutritionData); // Access the nutritionData string
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    // Function to format the nutrition data into HTML
    const formatNutritionData = (data) => {
        return data.split('\n').map((line, index) => {
            if (line.startsWith('**') && line.endsWith('**')) {
                // Bold headings
                return <h4 key={index} className="section-title">{line.replace(/\*\*/g, '')}</h4>;
            } else if (line.startsWith('* ')) {
                // List items
                return <li key={index} className="list-item">{line.replace('* ', '')}</li>;
            } else if (line.trim() === '') {
                // Empty lines (add spacing)
                return <br key={index} />;
            } else {
                // Regular paragraphs
                return <p key={index} className="paragraph">{line}</p>;
            }
        });
    };

    return (
        <div className="nutrition-container">
            <h2 className="nutrition-title">Nutrition Lookup</h2>
            <div className="search-container">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Enter food item"
                    className="search-input"
                />
                <button onClick={handleSearch} className="search-button">
                    Search
                </button>
            </div>
            {nutritionData && (
                <div className="nutrition-results">
                    <h3 className="results-title">Nutritional Information</h3>
                    <div className="results-data">
                        {formatNutritionData(nutritionData)}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NutritionInfo;
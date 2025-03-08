import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css'; // Ensure this file is updated with the new styles
import nutritionImage1 from './images/nutrition1.jpg'; // Replace with your image paths
import nutritionImage2 from './images/nutrition2.jpg';
import nutritionImage3 from './images/nutrition3.jpg';
import nutritionImage4 from './images/nutrition4.jpg';

const Home = () => {
    return (
        <div className="home-container">
            <div className="content">
                <h1 className="title">NutriGen</h1>
                <p className="subtitle">Your Personal Nutrition and Meal Planning Assistant</p>
                <div className="buttons">
                    <Link
                        to="/nutrition"
                        className="btn nutrition-btn"
                        style={{ textDecoration: 'none' }}
                    >
                        Nutrition Lookup
                    </Link>
                    <Link
                        to="/mealplan"
                        className="btn mealplan-btn"
                        style={{ textDecoration: 'none' }}
                    >
                        Generate Meal Plan
                    </Link>
                </div>
            </div>
            <div className="image-collage">
                <img src={nutritionImage1} alt="Nutrition 1" className="collage-image" />
                <img src={nutritionImage2} alt="Nutrition 2" className="collage-image" />
                <img src={nutritionImage3} alt="Nutrition 3" className="collage-image" />
                <img src={nutritionImage4} alt="Nutrition 4" className="collage-image" />
            </div>
        </div>
    );
};

export default Home;
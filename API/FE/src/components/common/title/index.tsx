//tsx for title component
import React from 'react';
import './title.css';
import logo from '../../../../assets/images/logo.svg';

const Title = () => {
    return (
        <div className="title-container">
                <img src={logo} alt="Logo" />
        </div>
    );
};
export default Title;
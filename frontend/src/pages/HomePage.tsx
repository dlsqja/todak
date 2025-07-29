import React from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
    return (
        <div>
            <h1>Home Page </h1>
            <p> 여기는 홈 화면입니다.</p>
            <ul>
                <li><Link to="/owner/home">Owner Home 이동</Link></li>
                <li><Link to="/vet/home">Vet Home 이동</Link></li>
                <li><Link to="/staff/home">Staff Home 이동</Link></li>
                <li><Link to="/role-redirect">Role Redirect 테스트</Link></li>
            </ul>
        </div>
    );
}

export default HomePage;
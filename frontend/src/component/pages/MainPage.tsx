import React from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
    return (
        <div>
            <h1 className='h1'>Home Page </h1>
            <br />
            <h3 className='h3'> 여기는 홈 화면입니다.</h3>
            <br />
            <ul>
                <li className='underline'><Link to="/owner/home">Owner Home 이동</Link></li>
                <li className='underline'><Link to="/vet/home">Vet Home 이동</Link></li>
                <li className='underline'><Link to="/staff/home">Staff Home 이동</Link></li>
                <li className='underline'><Link to="/role-redirect">Role Redirect 테스트</Link></li>
            </ul>
        </div>
    );
}

export default HomePage;
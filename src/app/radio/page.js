// page.js
'use client'
import Radio from '../components/radio/Radio';

export default function Page() {
  return (
    <div className="page-container">
      <Radio />
      <style jsx>{`
        .page-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          background-color: #282c34;
        }
      `}</style>
    </div>
  );
}

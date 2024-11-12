import React from 'react';

export const Credits = () => {
  return (
    <>
      <div className="pb-2">
        This app supports the free &quot;
        <a
          className="underline hover:no-underline"
          href="https://www.galacticpolymath.com/lessons/en-NZ/15"
          target="_blank"
        >
          Powerful Solutions
        </a>
        &quot; Unit for middle and high school. This unit introduces students to chemical and process engineering
        mindsets related to energy production, through an indigenous Māori lens. It was developed by Galactic Polymath
        Education Studio and &nbsp;
        <a
          className="underline hover:no-underline"
          href="https://profiles.canterbury.ac.nz/Matthew-Cowan"
          target="_blank"
        >
          Matthew Cowan’s research group
        </a>
        &nbsp; at the University of Canterbury in Christchurch, Aotearoa New Zealand
      </div>
      <div className="font-semibold">Funded by</div>
      <div>Designed by Madelyn Leembruggen and Matt Wilkins</div>
      <div className="font-semibold">Creative and cultural consultants</div>
      <div>Mel Tainui, Thomas Hamilton, and Andre Konia</div>
      <div className="font-semibold">Education consultants</div>
      <div>Andre Konia, Ella Houlihan</div>
      <div>
        <span className="font-semibold">Marae map illustrations</span> by Anna Wilkins
      </div>
      <div>Māori Background Designs by Ariki Creative</div>
      <div>Web App Developed by Monkeyjump Labs</div>
    </>
  );
};

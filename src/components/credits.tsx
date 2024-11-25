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
        mindsets related to energy production, through an indigenous Māori lens. It was developed by{' '}
        <a className="underline hover:no-underline" href=" https://www.galacticpolymath.com/" target="_blank">
          Galactic Polymath
        </a>
        &nbsp; Education Studio and &nbsp;
        <a
          className="underline hover:no-underline"
          href="https://profiles.canterbury.ac.nz/Matthew-Cowan"
          target="_blank"
        >
          Matthew Cowan’s research group
        </a>
        &nbsp; at the University of Canterbury in Christchurch, Aotearoa New Zealand
      </div>
      <div className="font-semibold pt-2">Funded by:</div>
      <div>
        <a
          className="underline hover:no-underline"
          href="https://www.mbie.govt.nz/science-and-technology/science-and-innovation/funding-information-and-opportunities/investment-funds/curious-minds/unlocking-curious-minds-fund/successful-2023-unlocking-curious-minds-contestable-fund-investment-round-proposals"
          target="_blank"
        >
          New Zealand Ministry for Business, Innovation, and Environment: 2024 Unlocking Curious Minds Fund
        </a>
        , and
        <br />
        <a
          className="underline hover:no-underline"
          href="https://www.canterbury.ac.nz/study/academic-study/engineering/schools-and-departments-engineering-forestry-product-design/chemical-and-process-engineering-department"
          target="_blank"
        >
          University of Canterbury: Department of Chemical and Process Engineering
        </a>
      </div>
      <div className="font-semibold pt-2">Designed by:</div>
      <div>Madelyn Leembruggen and Matt Wilkins</div>
      <div className="font-semibold pt-2">Creative, engineering, and cultural consultants</div>
      <div>Mel Tainui, Thomas Hamilton, and Andre Konia</div>
      <div className="font-semibold pt-2">Education consultants</div>
      <div>Andre Konia, Ella Houlihan</div>
      <div className="py-2">
        <span className="font-semibold">Marae map illustrations</span> by&nbsp;
        <a className="underline hover:no-underline" href="https://www.annamationvisdev.com/" target="_blank">
          Anna Wilkins
        </a>
      </div>
      <div className="py-2">
        <span className="font-semibold">Māori Background Designs</span> by&nbsp;
        <a className="underline hover:no-underline" href="https://www.arikicreative.com/" target="_blank">
          Ariki Creative
        </a>
      </div>
      <div className="py-2">
        <span className="font-semibold">Web App Developed</span> by&nbsp;
        <a className="underline hover:no-underline" href="https://www.monkeyjumplabs.com" target="_blank">
          Monkeyjump Labs
        </a>
      </div>
    </>
  );
};

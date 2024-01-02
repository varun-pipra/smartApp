import '@testing-library/jest-dom';
import React from 'react';
import { unmountComponentAtNode } from 'react-dom';
import { render, screen, fireEvent } from "@testing-library/react";
import ScrollDialog from './smartCertification';

let certData = [ { name: 'ABC' }, { name: 'DEF' }, { name: 'GHI' }, { name: 'ABE' }, { name: 'ABF' }, ];
let container:any = null; beforeEach(() => { container = document.createElement('div'); 
document.body.appendChild(container); });
 afterEach(() => { unmountComponentAtNode(container); container.remove(); container = null; });
 
 it('screen should contain all certifications and checkboxes ', () => { render(<ScrollDialog  />, container);
   const certifications = screen.getByTestId('certifications'); 
   const AllCertifications = certData.map((e) => e.name).join(''); 
   expect(certifications.textContent).toContain(AllCertifications); });
   
   it('Search list', () => { render(<ScrollDialog  />, container);
    const SEARCH_TEXT = 'AB'; const searchInput = screen.getByPlaceholderText('Search term...');
     fireEvent.change(searchInput, { target: { value: SEARCH_TEXT } });
      const certifications = screen.getByTestId('certifications');
       const filterData = certData .filter((ele) => ele.name.includes(SEARCH_TEXT)) .map((e) => e.name) .join(''); 
       expect(certifications.textContent).toContain(filterData); });

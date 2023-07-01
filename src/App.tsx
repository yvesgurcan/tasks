import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

enum QuadrantPropertyNames {
    importantUrgent = 'importantUrgent',
    importantNotUrgent = 'importantNotUrgent',
    notImportantUrgent = 'notImportantUrgent',
    notImportantNotUrgent = 'notImportantNotUrgent',
}

interface Quadrants {
    [QuadrantPropertyNames.importantUrgent]: string[];
    [QuadrantPropertyNames.importantNotUrgent]: string[];
    [QuadrantPropertyNames.notImportantUrgent]: string[];
    [QuadrantPropertyNames.notImportantNotUrgent]: string[];
}

const QUADRANT_BUILDERS = [
    {
        name: 'Important & Urgent: Do',
        property: QuadrantPropertyNames.importantUrgent,
    },
    {
        name: 'Important & Not Urgent: Schedule',
        property: QuadrantPropertyNames.importantNotUrgent,
    },
    {
        name: 'Not Important & Urgent: Delegate',
        property: QuadrantPropertyNames.notImportantUrgent,
    },
    {
        name: 'Not Important & Not Urgent: Eliminate',
        property: QuadrantPropertyNames.notImportantNotUrgent,
    },
];

const Quadrants = styled.div`
    box-sizing: border-box;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 5rem;
    width: 100vw;

    @media (max-width: 700px) {
        grid-template-columns: 1fr;
    }
`;

const QuadrantContainer = styled.div`
    box-sizing: border-box;
    min-height: 40vh;
    min-width: 50%;
    padding: 1rem;
`;

const QuadrantTitle = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const List = styled.ul`
    padding: 0;
`;

const ListItem = styled.li`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    min-height: 2.5rem;
    margin-bottom: 0.5rem;
`;

const DeleteItemButton = styled.button`
    background-color: tomato;
    padding: 5px 10px;
    cursor: pointer;
`;

const AddItemButton = styled.button`
    background-color: limegreen;
    padding: 5px 10px;
`;

const ExportImportContainer = styled.div`
    display: flex;
    justify-content: flex-end;
    padding-top: 1rem;
    padding-right: 1rem;
`;

const ExportButton = styled.button`
    background-color: #007bff;
    color: #fff;
    border: none;
    padding: 5px 10px;
`;

const ImportButton = styled.button`
    background-color: rgb(218, 27, 228);
    color: #fff;
    border: none;
    padding: 5px 10px;
    margin-left: 0.75rem;
    cursor: pointer;
`;

function formatTimestamp(date: Date): string {
    const year = date.getFullYear().toString().padStart(4, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${year}-${month}-${day}-${hours}-${minutes}-${seconds}`;
}

const App: React.FC = () => {
    const [quadrants, setQuadrants] = useState<Quadrants>({
        importantUrgent: [],
        importantNotUrgent: [],
        notImportantUrgent: [],
        notImportantNotUrgent: [],
    });

    const [updateLocalStorage, setUpdateLocalStorage] = useState(false);

    useEffect(() => {
        const savedQuadrants = localStorage.getItem('quadrants');
        if (savedQuadrants) {
            setQuadrants(JSON.parse(savedQuadrants));
        }
    }, []);

    useEffect(() => {
        if (updateLocalStorage) {
            localStorage.setItem('quadrants', JSON.stringify(quadrants));
            setUpdateLocalStorage(false);
        }
    }, [quadrants]);

    const handleAddItem = (quadrant: keyof Quadrants) => {
        const newItem = prompt('Enter a new item:');
        if (newItem) {
            setQuadrants((prevQuadrants) => ({
                ...prevQuadrants,
                [quadrant]: [...prevQuadrants[quadrant], newItem],
            }));
            setUpdateLocalStorage(true);
        }
    };

    const handleDeleteItem = (quadrant: keyof Quadrants, index: number) => {
        setQuadrants((prevQuadrants) => {
            const updatedQuadrant = prevQuadrants[quadrant].filter(
                (_, i) => i !== index
            );
            return {
                ...prevQuadrants,
                [quadrant]: updatedQuadrant,
            };
        });
        setUpdateLocalStorage(true);
    };

    const handleExportData = () => {
        const dataToExport = localStorage.getItem('quadrants');
        if (dataToExport) {
            const element = document.createElement('a');
            element.setAttribute(
                'href',
                'data:text/plain;charset=utf-8,' +
                    encodeURIComponent(dataToExport)
            );
            element.setAttribute(
                'download',
                `tasks_${formatTimestamp(new Date())}.json`
            );
            element.style.display = 'none';
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
        }
    };

    const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files && e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const importedData = event.target?.result as string;
                setQuadrants(JSON.parse(importedData));
            };
            reader.readAsText(file);
        }
    };

    return (
        <>
            <ExportImportContainer>
                <ExportButton onClick={handleExportData}>Export</ExportButton>
                <div>
                    <ImportButton>
                        <label htmlFor="import">Import</label>
                    </ImportButton>
                    <input
                        id="import"
                        name="import"
                        type="file"
                        accept=".json"
                        onChange={handleImportData}
                        style={{ display: 'none', visibility: 'hidden' }}
                    />
                </div>
            </ExportImportContainer>
            <Quadrants>
                {QUADRANT_BUILDERS.map((quadrantBuilder) => (
                    <QuadrantContainer key={quadrantBuilder.name}>
                        <QuadrantTitle>
                            <h2>{quadrantBuilder.name}</h2>
                            <AddItemButton
                                onClick={() =>
                                    handleAddItem(quadrantBuilder.property)
                                }
                            >
                                ➕
                            </AddItemButton>
                        </QuadrantTitle>
                        <List>
                            {quadrants[quadrantBuilder.property].map(
                                (item, index) => {
                                    return (
                                        <ListItem key={`${item}-${index}`}>
                                            {item}{' '}
                                            <DeleteItemButton
                                                onClick={() =>
                                                    handleDeleteItem(
                                                        quadrantBuilder.property,
                                                        index
                                                    )
                                                }
                                            >
                                                ➖
                                            </DeleteItemButton>
                                        </ListItem>
                                    );
                                }
                            )}
                        </List>
                    </QuadrantContainer>
                ))}
            </Quadrants>
        </>
    );
};

export default App;

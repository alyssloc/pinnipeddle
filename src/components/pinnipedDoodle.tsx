import { useState } from 'react';
import { SPECIES_DATA } from '../pinnipeds/pinnipeds.ts';
import { MAX_ATTEMPTS } from '../pinnipeds/types.ts';
import Search from './Search.tsx'


export default function PinnipedDoodle() {
    const images = import.meta.glob('/src/assets/images/*.{jpg,jpeg,png,webp}', { eager: true });
    //const [guess, setGuess] = useState("");
    const [attempts, setAttempts] = useState<number>(0); 
    const [pinniped, setPinniped] = useState(SPECIES_DATA[Math.floor(Math.random() * SPECIES_DATA.length)]);
    const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>('playing');
    const [guessedList, setGuessedList] = useState<string[]>([]);

    //images have same names as the pinniped ids (pinniped_id.jpg)
    const getImage = (imageName: string) => {
        for (const path in images) {
            if (path.includes(`/${imageName}.`)) {
                return (images[path] as { default: string })?.default || (images[path] as string);
            }
        }
        return '';
    };

    const clues = pinniped.clues;
    
    //reset to select a diff pinniped, return attempts to 0, and clear the guess
    const resetGame = () => {
        setPinniped(SPECIES_DATA[Math.floor(Math.random() * SPECIES_DATA.length)]);
        setAttempts(0);
        //setGuess("");
        setGameStatus('playing');
        setGuessedList([]);
    };


    //update guess, # attempts, and guessed list, and check if guess was correct and
    //if the game is over
    const handleGuessSubmit = (input: string) => {
        const isCorrect = input.toLowerCase() === pinniped.name.toLowerCase();
        const updatedAttempts = attempts + 1;

        //setGuess(input);
        setAttempts(updatedAttempts);
        setGuessedList((prev) => [...prev, input]);

        if (isCorrect) {
            setGameStatus('won');
        } else if (updatedAttempts >= MAX_ATTEMPTS) {
            setGameStatus('lost');
        }

        
    }

    const numCluesToReveal = gameStatus === 'playing' ? attempts + 1 : attempts;
    const revealedClues = clues.slice(0, numCluesToReveal);

    //end of game screen
    return (
        <div className="game-container" style={{ 
            padding: '30px', 
            maxWidth: '500px', 
            margin: '40px auto', 
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            backgroundColor: '#ffffff', 
            borderRadius: '16px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.1)', 
            color: '#08022e' 
        }}>
            <h1 style={{ color: '#1a1a1a' }}>Pinnipeddle</h1>
            <p style={{ color: '#1a1a1a' }}>Attempts: {attempts} / {MAX_ATTEMPTS}</p>
            
            <div className="clues-box" style={{ 
                background: '#f8f9fa', 
                color: '#08022e',
                padding: '20px', 
                borderRadius: '12px', 
                marginBottom: '20px',
                width: '100%',
                boxSizing: 'border-box',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}>
                <h3 style={{ marginTop: 0, color: '#1a1a1a' }}>Clues:</h3>
                <ul style={{ listStyleType: 'none', padding: 0 }}>
                    {revealedClues.map((clue, index) => {
                        let bgColor = 'transparent';
                        if (gameStatus === 'won' && index === attempts - 1) {
                            bgColor = 'rgba(0, 255, 0, 0.2)'; //green for correct guess
                        }
                        else if (index < attempts) {
                            bgColor = 'rgba(255, 0, 0, 0.15)'; //red for wrong guess
                        }
                        return (
                            <li key={index} style={{ 
                                marginBottom: '10px', 
                                padding: '12px',
                                borderRadius: '8px',
                                backgroundColor: bgColor,
                                border: '1px solid #d1d1d1'
                            }}>
                                {index + 1}. {clue}
                            </li>
                        );
                    })}
                </ul>
            </div>


            {gameStatus === 'playing' && (
                <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                    <Search onSelect={handleGuessSubmit} guessedList={guessedList} />
                </div>
            )}

            {gameStatus !== 'playing' && (
                <div className="game-summary" style={{ 
                    textAlign: 'center', 
                    padding: '20px',
                    background: 'white',
                    borderRadius: '12px',
                    width: '100%',
                    boxSizing: 'border-box',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                }}>
                    {gameStatus === 'won' ? (
                        <h1 style={{ color: 'green', margin: '10px 0' }}>Nice work!</h1>
                    ) : (
                        <h1 style={{ color: 'red', margin: '10px 0' }}>Nice try!</h1>
                    )}
                    
                    <h2 style={{ margin: '10px 0', color: '#1a1a1a' }}>{pinniped.name}</h2>
                    <p style={{ margin: '5px 0' }}><i>Scientific Name: {pinniped.scientificName}</i></p>
                    
                    {getImage(pinniped.id) ? (
                        <img 
                            src={getImage(pinniped.id)} 
                            alt={pinniped.name} 
                            style={{ maxWidth: '100%', maxHeight: '250px', borderRadius: '8px', margin: '15px 0', objectFit: 'cover' }} 
                        />
                    ) : (
                        <p style={{ color: 'gray' }}>[Image not found]</p>
                    )}
                    
                    <p style={{ margin: '10px 0', lineHeight: '1.4' }}><strong>Range:</strong> {pinniped.range}</p>
                    
                    <button 
                        onClick={resetGame} 
                        style={{ 
                            marginTop: '20px', 
                            padding: '12px 24px', 
                            cursor: 'pointer',
                            fontSize: '16px',
                            border: 'none',
                            borderRadius: '8px',
                            backgroundColor: '#5D8896',
                            color: 'white',
                            fontWeight: 'bold'
                        }}
                    >
                        Play Again
                    </button>
                </div>
            )}
        </div>
    );
}
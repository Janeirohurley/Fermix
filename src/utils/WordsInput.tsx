/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useRef, useEffect } from 'react';

interface WordsInputProps {
    initialValue: string[];
    inputtitle: string;
    inputlabel: string;
    getvalue: (value: string[]) => void;
}

function WordsInput({ initialValue, inputtitle, inputlabel, getvalue }: WordsInputProps) {
    const [textareaVisible, setTextareaVisible] = useState(true);
    const [textareaValue, setTextareaValue] = useState(initialValue.join('\n'));
    const [wordsArray, setWordsArray] = useState(initialValue);
    const textareaRef = useRef(null);

    const handleFocus = () => {
        setTextareaVisible(true);
        setTextareaValue(wordsArray.join('\n'));

    };

    useEffect(() => {
        if (textareaVisible && textareaRef.current) {
            // Focus sur le textarea lorsque visible
            (textareaRef.current as HTMLTextAreaElement).focus();

        }
        setTextareaValue(initialValue.join('\n'));
        setTextareaValue(initialValue.join('\n'));
    }, [textareaVisible]);

    const handleBlur = () => {
        const newWords = textareaValue
            .split('\n')
            .map(w => w.trim())
            .filter(w => w !== '');
        setWordsArray(newWords);
        getvalue(newWords);
        setTextareaVisible(false);
    };

    const handleKeyDown = (e: { key: string; shiftKey: any; preventDefault: () => void; }) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            // Empêche retour à la ligne si on n'appuie pas sur shift
            e.preventDefault();
        }
    };

    const handleChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
        setTextareaValue(e.target.value);
    };

    return (
        <div>


            <label htmlFor={inputlabel} className="block text-sm font-medium text-gray-700 mb-1">{inputtitle}</label>
            <ul className="list-disc list-inside  text-gray-900 ml-4">
                {
                    initialValue.length > 0 && initialValue.map((i, index) => (
                        <li className='' key={index}><small>{i}</small></li>
                    ))
                }
            </ul>
            {textareaVisible ? (
                <textarea
                    id={inputlabel}
                    name={inputlabel}
                    ref={textareaRef}
                    autoFocus
                    value={textareaValue}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    onBlur={handleBlur}
                    rows={wordsArray.length || 5
                    }
                    style={{ width: '100%', resize: 'none' }}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-bic-green focus:border-bic-green"
                    placeholder="Écris avec Shift + Entrée pour nouvelle ligne"
                />
            ) : (
                <div
                    tabIndex={0}
                    onFocus={handleFocus}
                    style={{
                        border: '1px solid gray',
                        padding: '8px',
                        borderRadius: '4px',
                        cursor: 'text',
                        minHeight: '100px',
                        whiteSpace: 'pre-line',
                    }}
                >
                    {wordsArray.length === 0 ? (
                        <span style={{ color: '#999' }}>Clique ici pour ajouter des mots…</span>
                    ) : (
                        wordsArray.map((word, index) => (
                            <div key={index}>{word}</div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}

export default WordsInput;

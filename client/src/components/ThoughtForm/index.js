import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { ADD_THOUGHT } from '../../utils/mutations';
import { QUERY_THOUGHTS, QUERY_ME } from '../../utils/queries';

const ThoughtForm = () => {
    const [thoughtText, setthoughtText] = useState('');
    const [characterCount, setCharacterCount] = useState(0);
    const [addThought, { error }] = useMutation(ADD_THOUGHT, {
        update(cache, { data: { addThought } }) {
      
            // could potentially not exist yet, so wrap in a try/catch
          try {
            // update me array's cache
            const { me } = cache.readQuery({ query: QUERY_ME });
            cache.writeQuery({
              query: QUERY_ME,
              data: { me: { ...me, thoughts: [...me.thoughts, addThought] } },
            });
          } catch (e) {
            console.warn("First thought insertion by user!")
          }
      
          // update thought array's cache
          const { thoughts } = cache.readQuery({ query: QUERY_THOUGHTS });
          cache.writeQuery({
            query: QUERY_THOUGHTS,
            data: { thoughts: [addThought, ...thoughts] },
          });
        }
    });

    // handle change for textarea
    const handleChange = event => {
        if(event.target.value.length <= 280) {
            setthoughtText(event.target.value);
            setCharacterCount(event.target.value.length);
        }
    };

    // form submission
    const handleFormSubmit = async event => {
        event.preventDefault();

        try {
            // add thought
            await addThought({
                variables: { thoughtText }
            });

            setthoughtText('');
            setCharacterCount(0);
        } catch(e) {
            console.log(e);
        }
        
    }

    // ThoughtForm
    return (
        <div>
            <p className={`m-0 ${characterCount === 280 ? 'text-error' : ''}`}>
                Character Count: {characterCount}/280
                {error && <span className='ml-2'>Something went wrong...</span>}
            </p>
            <form className='flex-row justify-center justify-space-between-md align-stretch' onSubmit={handleFormSubmit}>
                <textarea placeholder="Here's a new Thought..." 
                    className='form-input col-12 col-md-9'
                    value={thoughtText}
                    onChange={handleChange}>
                </textarea>
                <button className='btn col-12 col-md-3' type="submit">
                    Submit
                </button>
            </form>
        </div>
    )
}

export default ThoughtForm;
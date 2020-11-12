import React, { useState } from 'react'
import { Form, Button } from 'react-bootstrap'

const SearchBox = ({ history }) => {
  const [keyword, setKeyword] = useState('')

  const submitHandler = (e) => {
    e.preventDefault()
    if (keyword.trim()) {
      history.push(`/search/${keyword}`)
      setKeyword('')
    } else {
      history.push('/')
      setKeyword('')
    }
  }

  return (
    <Form onSubmit={submitHandler} inline>
      <Form.Control
        type='text'
        name='q'
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder='Search Products...'
        className='mr-sm-2 mt-sm-3 mb-sm-3 rounded ml-lg-3'
      ></Form.Control>
      <Button
        type='submit'
        variant='outline-secondary'
        className='py-1 rounded search-submit-button'
      >
        Search
      </Button>
    </Form>
  )
}

export default SearchBox

import React, { useEffect, useState } from 'react';

const SearchPage = () => {

  useEffect(() => {
    document.title = 'Search Page';
  })

  return (
    <h1>
      Search Page
    </h1>
  )
}

export default SearchPage

import { useState } from 'react';
import Head from 'next/head';
import AutocompleteSearch from '../components/AutocompleteSearch';
import BookCard from '../components/BookCard';

export default function Home() {
  const [selectedBooks, setSelectedBooks] = useState([]);

  const handleSelect = async (id) => {
    const response = await fetch(`https://search-backend-delta.vercel.app/api/book/${id}`);
    const book = await response.json();
    setSelectedBooks((prevBooks) => [...prevBooks, book]);
  };

  return (
    <div className="min-h-screen bg-white">
      <Head>
        <title>AI Book Search</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto px-4 py-20">
        <div className="max-w-2xl mx-auto mb-16 text-center">
          <h1 className="text-8xl font-bold mb-8">
            <span className="text-blue-500">A</span>
            <span className="text-red-500">I</span>
            <span className="text-yellow-500">B</span>
            <span className="text-blue-500">o</span>
            <span className="text-green-500">o</span>
            <span className="text-red-500">k</span>
          </h1>
          <AutocompleteSearch onSelect={handleSelect} />
        </div>
        {selectedBooks.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Search Results</h2>
            <div className="space-y-4">
              {selectedBooks.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          </div>
        )}
      </main>
      <footer className="absolute bottom-0 w-full py-4 bg-gray-100 text-center">
        <a href="#" className="text-gray-600 hover:text-gray-800 mx-2">About</a>
        <a href="#" className="text-gray-600 hover:text-gray-800 mx-2">Privacy</a>
        <a href="#" className="text-gray-600 hover:text-gray-800 mx-2">Terms</a>
        <a href="#" className="text-gray-600 hover:text-gray-800 mx-2">Settings</a>
      </footer>
    </div>
  );
}
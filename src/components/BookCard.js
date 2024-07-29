import { Book } from 'lucide-react';

export default function BookCard({ book }) {
  return (
    <div className="mb-6">
      <div className="flex items-center">
        <Book className="mr-2 text-gray-400" size={16} />
        <a href="#" className="text-blue-800 hover:underline text-xl">
          {book.title}
        </a>
      </div>
      <p className="text-sm text-green-700 mb-1">{`by ${book.author}`}</p>
      <p className="text-sm text-gray-600 line-clamp-2">{book.summary}</p>
    </div>
  );
}
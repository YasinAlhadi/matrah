import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  where,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '../../firebase.config';
import { useParams } from 'react-router-dom';
import ListingItem from '../components/ListingItem';
import Skeleton from '../components/Skeleton';

export default function Category() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastDoc, setLastDoc] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const prams = useParams();

  useEffect(() => {
    async function fetchListings() {
      const listRef = collection(db, 'listings');
      const q = query(
        listRef,
        where('type', '==', prams.categName),
        orderBy('timeStamp', 'desc'),
        limit(4)
      );
      const querySnap = await getDocs(q);
      const listings = [];
      querySnap.forEach((doc) => {
        listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      setListings(listings);
      setLoading(false);
      if (querySnap.docs.length < 4) {
        setHasMore(false);
      } else {
        setLastDoc(querySnap.docs[querySnap.docs.length - 1]);
      }
    }
    fetchListings();
  }, [prams.categName]);

  async function fetchMoreListings() {
    const listRef = collection(db, 'listings');
    const q = query(
      listRef,
      where('type', '==', type),
      orderBy('timeStamp', 'desc'),
      startAfter(lastDoc),
      limit(4)
    );
    const querySnap = await getDocs(q);
    const newlistings = [];
    querySnap.forEach((doc) => {
      newlistings.push({
        id: doc.id,
        data: doc.data(),
      });
    });
    setListings([...listings, ...newlistings]);
    if (querySnap.docs.length < 4) {
      setHasMore(false);
    } else {
      setLastDoc(querySnap.docs[querySnap.docs.length - 1]);
    }
  }

  return (
    <main>
      <section className="container mx-auto px-4 py-10">
        <h1 className="text-2xl font-semibold mb-4">
          {prams.categName === 'sale' ? 'For Sale' : 'For Rent'}
        </h1>
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {listings.map(({ id, data }) => (
            <ListingItem key={id} id={id} listing={data} />
          ))}
        </ul>
        {loading && <Skeleton />}
        {hasMore && !loading ? (
          <div className="flex justify-center items-center">
            <button
              onClick={fetchMoreListings}
              className="border-gray-700 text-blue-700 py-2 px-4 rounded-full"
            >
              Load More
            </button>
          </div>
        ) : (
          <div className="flex justify-center items-center">
            <p className="text-gray-500">No more listings</p>
          </div>
        )}
      </section>
    </main>
  );
}

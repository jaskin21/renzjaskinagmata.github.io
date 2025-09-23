// App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Suspense, lazy } from 'react';
import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

import { store } from './stores/store';
import Loading from './pages/Loading';

// Utility to delay lazy loading (for testing/demo purposes)
const delayImport = <T extends { default: React.ComponentType<any> }>(
  importFunc: () => Promise<T>,
  delay: number = 1000
): Promise<T> =>
  new Promise((resolve) => {
    setTimeout(() => {
      importFunc().then(resolve);
    }, delay);
  });

// Lazy-loaded pages
const HomePage = lazy(() => delayImport(() => import('./pages/HomePage')));
const NotFoundPage = lazy(() =>
  delayImport(() => import('./pages/NotFoundPage'))
);

export default function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <ToastContainer />
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path='/' element={<HomePage />} />
            <Route path='*' element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </Provider>
  );
}

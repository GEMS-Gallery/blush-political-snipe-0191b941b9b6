import React, { useState, useEffect } from 'react';
import { backend } from 'declarations/backend';
import { Box, CircularProgress, Container, Typography, TextField, Button, List, ListItem, ListItemText } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useQuill } from 'react-quilljs';
import 'quill/dist/quill.snow.css';

interface Page {
  id: bigint;
  title: string | null;
  content: string | null;
}

const App: React.FC = () => {
  const [pages, setPages] = useState<Page[]>([]);
  const [selectedPage, setSelectedPage] = useState<Page | null>(null);
  const [loading, setLoading] = useState(true);
  const { quill, quillRef } = useQuill();

  useEffect(() => {
    fetchPages();
  }, []);

  useEffect(() => {
    if (quill && selectedPage) {
      quill.root.innerHTML = selectedPage.content || '';
      quill.on('text-change', () => {
        setSelectedPage(prev => prev ? { ...prev, content: quill.root.innerHTML } : null);
      });
    }
  }, [quill, selectedPage]);

  const fetchPages = async () => {
    try {
      const result = await backend.getPages();
      setPages(result);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching pages:', error);
      setLoading(false);
    }
  };

  const createPage = async () => {
    try {
      setLoading(true);
      const id = await backend.createPage([]);
      await fetchPages();
      setSelectedPage({ id, title: null, content: null });
    } catch (error) {
      console.error('Error creating page:', error);
    } finally {
      setLoading(false);
    }
  };

  const updatePage = async () => {
    if (!selectedPage) return;
    try {
      setLoading(true);
      await backend.updatePage(selectedPage.id, [selectedPage.title], [selectedPage.content]);
      await fetchPages();
    } catch (error) {
      console.error('Error updating page:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (selectedPage) {
      setSelectedPage({ ...selectedPage, title: event.target.value });
    }
  };

  return (
    <Container maxWidth="lg" className="min-h-screen flex">
      <Box className="w-64 border-r p-4">
        <Typography variant="h6" className="mb-4">Pages</Typography>
        <List>
          {pages.map((page) => (
            <ListItem
              key={page.id.toString()}
              button
              onClick={() => setSelectedPage(page)}
              selected={selectedPage?.id === page.id}
            >
              <ListItemText primary={page.title || 'Untitled'} />
            </ListItem>
          ))}
        </List>
        <Button
          startIcon={<AddIcon />}
          onClick={createPage}
          fullWidth
          variant="outlined"
          className="mt-4"
        >
          New Page
        </Button>
      </Box>
      <Box className="flex-grow p-4">
        {loading ? (
          <CircularProgress />
        ) : selectedPage ? (
          <>
            <TextField
              fullWidth
              variant="outlined"
              value={selectedPage.title || ''}
              onChange={handleTitleChange}
              onBlur={updatePage}
              placeholder="Untitled"
              className="mb-4"
            />
            <div ref={quillRef} />
            <Button onClick={updatePage} variant="contained" color="primary" className="mt-4">
              Save
            </Button>
          </>
        ) : (
          <Typography>Select a page or create a new one</Typography>
        )}
      </Box>
    </Container>
  );
};

export default App;

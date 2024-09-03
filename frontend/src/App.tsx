import React, { useState, useEffect, useRef } from 'react';
import { backend } from 'declarations/backend';
import { Box, CircularProgress, Container, Typography, TextField, Button, List, ListItem, ListItemText, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import FolderIcon from '@mui/icons-material/Folder';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

interface Page {
  id: bigint;
  title: string | null;
  content: string | null;
  categoryId: bigint | null;
}

interface Category {
  id: bigint;
  name: string;
}

const App: React.FC = () => {
  const [pages, setPages] = useState<Page[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedPage, setSelectedPage] = useState<Page | null>(null);
  const [loading, setLoading] = useState(true);
  const [openCategoryDialog, setOpenCategoryDialog] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const quillRef = useRef<Quill | null>(null);
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchCategories();
    fetchPages();
  }, []);

  useEffect(() => {
    if (editorRef.current && !quillRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: 'snow',
        modules: {
          toolbar: [
            [{ header: [1, 2, false] }],
            ['bold', 'italic', 'underline'],
            ['image', 'code-block']
          ]
        },
      });

      quillRef.current.on('text-change', () => {
        if (selectedPage && quillRef.current) {
          setSelectedPage(prev => prev ? { ...prev, content: quillRef.current?.root.innerHTML || '' } : null);
        }
      });
    }

    if (quillRef.current && selectedPage) {
      quillRef.current.root.innerHTML = selectedPage.content || '';
    }
  }, [selectedPage]);

  const fetchCategories = async () => {
    try {
      const result = await backend.getCategories();
      setCategories(result);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

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

  const createCategory = async () => {
    try {
      await backend.createCategory(newCategoryName);
      setNewCategoryName('');
      setOpenCategoryDialog(false);
      await fetchCategories();
    } catch (error) {
      console.error('Error creating category:', error);
    }
  };

  const createPage = async (categoryId: bigint | null) => {
    try {
      setLoading(true);
      const id = await backend.createPage([], categoryId ? [categoryId] : []);
      await fetchPages();
      setSelectedPage({ id, title: null, content: null, categoryId });
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
      await backend.updatePage(selectedPage.id, [selectedPage.title], [selectedPage.content], [selectedPage.categoryId]);
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
        <Typography variant="h6" className="mb-4">Categories</Typography>
        <List>
          {categories.map((category) => (
            <React.Fragment key={category.id.toString()}>
              <ListItem>
                <FolderIcon className="mr-2" />
                <ListItemText primary={category.name} />
              </ListItem>
              <List className="pl-4">
                {pages
                  .filter(page => page.categoryId === category.id)
                  .map((page) => (
                    <ListItem
                      key={page.id.toString()}
                      button
                      onClick={() => setSelectedPage(page)}
                      selected={selectedPage?.id === page.id}
                    >
                      <ListItemText primary={page.title || 'Untitled'} />
                    </ListItem>
                  ))}
                <ListItem>
                  <Button
                    startIcon={<AddIcon />}
                    onClick={() => createPage(category.id)}
                    fullWidth
                    variant="text"
                    size="small"
                  >
                    New Page
                  </Button>
                </ListItem>
              </List>
            </React.Fragment>
          ))}
        </List>
        <Button
          startIcon={<AddIcon />}
          onClick={() => setOpenCategoryDialog(true)}
          fullWidth
          variant="outlined"
          className="mt-4"
        >
          New Category
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
            <div ref={editorRef} className="mb-4" />
            <Button onClick={updatePage} variant="contained" color="primary" className="mt-4">
              Save
            </Button>
          </>
        ) : (
          <Typography>Select a page or create a new one</Typography>
        )}
      </Box>
      <Dialog open={openCategoryDialog} onClose={() => setOpenCategoryDialog(false)}>
        <DialogTitle>Create New Category</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Category Name"
            fullWidth
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCategoryDialog(false)}>Cancel</Button>
          <Button onClick={createCategory} color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default App;

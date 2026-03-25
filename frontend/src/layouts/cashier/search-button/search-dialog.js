import { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import SearchMdIcon from '@untitled-ui/icons-react/build/esm/SearchMd';
import XIcon from '@untitled-ui/icons-react/build/esm/X';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { Tip } from 'src/components/tip';
import { wait } from 'src/utils/wait';

const articles = {
  Platform: [
    {
      description:
        'Provide your users with the content they need, exactly when they need it, by building a next-level site search experience using our AI-powered search API.',
      title: 'Level up your site search experience with our hosted API',
      path: 'Users / Api-usage',
    },
    {
      description:
        'Algolia is a search-as-a-service API that helps marketplaces build performant search experiences at scale while reducing engineering time.',
      title: 'Build performant marketplace search at scale',
      path: 'Users / Api-usage',
    },
  ],
  Resources: [
    {
      description: 'Algolia’s architecture is heavily redundant, hosting every application on …',
      title: 'Using NetInfo API to Improve Algolia’s JavaScript Client',
      path: 'Resources / Blog posts',
    },
    {
      description:
        'Algolia is a search-as-a-service API that helps marketplaces build performant search experiences at scale while reducing engineering time.',
      title: 'Build performance',
      path: 'Resources / UI libraries',
    },
  ],
};

export const SearchDialog = (props) => {
  const { onClose, open = false, ...other } = props;
  const [value, setValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [displayArticles, setDisplayArticles] = useState(false);

  const handleSubmit = useCallback(async (event) => {
    event.preventDefault();
    setDisplayArticles(false);
    setIsLoading(true);
    // Do search here
    await wait(1500);
    setIsLoading(false);
    setDisplayArticles(true);
  }, []);

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      onClose={onClose}
      open={open}
      {...other}
    >
      <Stack
        direction="row"
        spacing={3}
        sx={{
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 3,
          py: 2,
        }}
      >
        <Typography variant="h6">Search</Typography>
        <IconButton
          color="inherit"
          onClick={onClose}
        >
          <SvgIcon>
            <XIcon />
          </SvgIcon>
        </IconButton>
      </Stack>
      <DialogContent>
        <Tip message="Search by entering a keyword and pressing Enter" />
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ mt: 3 }}
        >
          <TextField
            fullWidth
            label="Search"
            onChange={(event) => setValue(event.target.value)}
            placeholder="Search..."
            value={value}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SvgIcon>
                      <SearchMdIcon />
                    </SvgIcon>
                  </InputAdornment>
                ),
              },
            }}
          />
        </Box>
        {isLoading && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              mt: 3,
            }}
          >
            <CircularProgress />
          </Box>
        )}
        {displayArticles && (
          <Stack
            spacing={2}
            sx={{ mt: 3 }}
          >
            {Object.keys(articles).map((type, index) => (
              <Stack
                key={index}
                spacing={2}
              >
                <Typography variant="h6">{type}</Typography>
                <Stack
                  divider={<Divider />}
                  sx={{
                    borderColor: 'divider',
                    borderRadius: 1,
                    borderStyle: 'solid',
                    borderWidth: 1,
                  }}
                >
                  {articles[type].map((article) => (
                    <Box
                      key={article.title}
                      sx={{ p: 2 }}
                    >
                      <Stack
                        direction="row"
                        spacing={2}
                        sx={{
                          alignItems: 'center',
                          pl: 1,
                        }}
                      >
                        <Badge
                          color="primary"
                          variant="dot"
                        />
                        <Typography variant="subtitle1">{article.title}</Typography>
                      </Stack>
                      <Typography
                        variant="body2"
                        sx={{
                          color: 'text.secondary',
                        }}
                      >
                        {article.path}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: 'text.secondary',
                          mt: 1,
                        }}
                      >
                        {article.description}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </Stack>
            ))}
          </Stack>
        )}
      </DialogContent>
    </Dialog>
  );
};

SearchDialog.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
};

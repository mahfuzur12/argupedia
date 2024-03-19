import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  card: {
    position: 'relative',
  },
  cardContent: {
  },
  expandedCard: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    zIndex: 9999,
  },
  expandedCardContent: {
    width: '100%',
    height: '100%',
    overflowY: 'auto',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: theme.spacing(2),
  },
  collapseButton: {
    position: 'absolute',
    top: theme.spacing(1),
    right: theme.spacing(1),
  },
  expandIconContainer: {
    position: 'absolute',
    bottom: theme.spacing(1),
    right: theme.spacing(1),
    '& svg': {
      fontSize: '2rem',
    },
  },
  centerContent: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100%',
  },
  summaryContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  replyButton: {
    padding: '8px 16px', 
    border: '1px solid #ccc', 
    borderRadius: '4px', 
    backgroundColor: '#ffffff', 
    color: theme.palette.text.primary, 
    transition: 'background-color 0.3s, color 0.3s', 
    '&:hover': {
      backgroundColor: '#f0f0f0',
      color: theme.palette.text.secondary, 
    },
    position: 'absolute',
    top: theme.spacing(1), 
    right: theme.spacing(1), 
  },

}));

export default useStyles;

import { context, reddit } from '@devvit/web/server';

export const createPost = async () => {
  const { subredditName } = context;
  if (!subredditName) {
    throw new Error('subredditName is required');
  }

  return await reddit.submitCustomPost({
    splash: {
      // Splash Screen Configuration
      appDisplayName: 'Thread of Clues',
      backgroundUri: 'splash.png',
      buttonLabel: 'Start Investigating',
      description: 'Collaborate with others to solve mysteries across cities.',
      entryUri: 'index.html',
      heading: 'Welcome to Thread of Clues!',
      appIconUri: 'logo.png',
    },
    postData: {
      gameState: 'initial',
      score: 0,
    },
    subredditName: subredditName,
    title: 'Thread of Clues - First 2 Cities',
  });
};

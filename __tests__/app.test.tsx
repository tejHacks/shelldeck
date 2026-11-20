import AsyncStorage from '@react-native-async-storage/async-storage';
import { fireEvent, renderRouter, screen, waitFor } from 'expo-router/testing-library';

import { commands } from '@/data/commands';

jest.mock('expo-clipboard', () => ({ setStringAsync: jest.fn(() => Promise.resolve(true)) }));

const APP = './src/app';

beforeEach(async () => {
  jest.useRealTimers();
  await AsyncStorage.clear();
});

describe('ShellDeck', () => {
  it('filters by shell', async () => {
    await renderRouter(APP, { initialUrl: '/' });
    const fishCount = commands.filter((c) => c.shell === 'fish').length;
    await fireEvent.press(await screen.findByText('Fish'));
    expect(await screen.findByText(new RegExp(`^${fishCount} results in`))).toBeOnTheScreen();
  });

  it('shows dangerous commands with a warning', async () => {
    await renderRouter(APP, { initialUrl: '/command/linux-rm' });
    expect(await screen.findByText(/Careful: this can delete data/)).toBeOnTheScreen();
  });

  it('shows saved commands and an empty state', async () => {
    await renderRouter(APP, { initialUrl: '/saved' });
    expect(await screen.findByText('Nothing saved yet')).toBeOnTheScreen();
  });

  it('lists saved commands from storage', async () => {
    await AsyncStorage.setItem('shelldeck:v1', JSON.stringify({ saved: ['linux-grep', 'gone-id'], recent: [] }));
    await renderRouter(APP, { initialUrl: '/saved' });
    expect(await screen.findByText('SAVED (1)')).toBeOnTheScreen();
    expect(screen.getByLabelText(/^grep: /)).toBeOnTheScreen();
  });

  it('compares the same task across shells', async () => {
    await renderRouter(APP, { initialUrl: '/compare' });
    expect(await screen.findByText('Export a variable')).toBeOnTheScreen();
    expect(screen.getByText('set -gx EDITOR vim')).toBeOnTheScreen();
  });

  it('runs the speed test on the About screen', async () => {
    await renderRouter(APP, { initialUrl: '/about' });
    await fireEvent.press(await screen.findByText('Run 1000 searches'));
    expect(await screen.findByText('Average search (1000 runs)')).toBeOnTheScreen();
  });
  // Runs last: the test router keeps navigation state between renders that start at '/'.
  it('searches, opens a command, copies an example and saves it', async () => {
    await renderRouter(APP, { initialUrl: '/' });
    expect(await screen.findByText(new RegExp(`^${commands.length} results in`))).toBeOnTheScreen();

    await fireEvent.changeText(screen.getByLabelText('Search commands'), 'tar');
    await waitFor(() => expect(screen.queryByText(new RegExp(`^${commands.length} results`))).toBeNull());

    await fireEvent.press(screen.getAllByLabelText(/^tar: /)[0]);
    expect(await screen.findByText('Bundle files into an archive (and compress)')).toBeOnTheScreen();
    expect(screen.getByText('Create a gzip archive')).toBeOnTheScreen();

    await fireEvent.press(screen.getByLabelText('Copy tar czf site.tar.gz site/'));
    await waitFor(() => expect(require('expo-clipboard').setStringAsync).toHaveBeenCalledWith('tar czf site.tar.gz site/'));

    await fireEvent.press(screen.getByLabelText('Save command'));
    expect(await screen.findByLabelText('Remove from saved')).toBeOnTheScreen();
    await waitFor(async () => expect(await AsyncStorage.getItem('shelldeck:v1')).toContain('linux-tar'));
  });
});

import { setOptions } from '@storybook/addon-options'
import { configure } from '@storybook/react';

setOptions({
  addonPanelInRight: true,
  name: "Advanced Algos Web Components",
});

// automatically import all files ending in *.stories.js
const req = require.context('../stories', true, /.stories.js$/);
function loadStories() {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);

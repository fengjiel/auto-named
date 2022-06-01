function convertToKebabCase(string) {
  return string
    .replace(/([a-z])([A-Z])/g, '$1$2')
    .replace(/\s+/g, '')
    .replace(/^\S/, (s) => s.toUpperCase());
}

function setChunkName(filename) {
  return filename
    .replace('pages', '')
    .split('/')
    .map((part) => part.replace(/\..*$/, ''))
    .filter(Boolean)
    .map(convertToKebabCase)
    .join('');
}
function hasComment(comment) {
  return (
    comment &&
    comment.value.replace(/\*+/g, '').trim().startsWith('webpackChunkName')
  );
}

module.exports = function ({ types: t }) {
  return {
    visitor: {
      CallExpression(path) {
        if (path.node.callee.type !== 'Import') {
          return;
        }

        const [arg] = path.node.arguments;
        const [comment] = arg.leadingComments || [];

        if (!hasComment(comment)) {
          t.addComment(
            arg,
            'leading',
            `webpackChunkName: '${setChunkName(arg.value)}'`
          );
        }
      },
    },
  };
};

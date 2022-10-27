import { getAllSitemapItems } from '../sitemap';

test('getAllItems', () => {
  const items = getAllSitemapItems([
    {
      name: 'test',
      to: 'test',
      children: [
        { name: 'test2', to: 'test2', children: [{ name: 'test3', to: 'test3' }] },
      ],
    },
  ]);
  expect(items).toHaveLength(3);
  expect(items[0].name).toBe('test');
  expect(items[0].to).toBe('test');
  expect(items[1].name).toBe('test2');
});

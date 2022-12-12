import { getAllSitemapItems, SitemapItem } from '../sitemap';
import sitemap from '../../sitemap.new.json';

test('getAllItems', () => {
  const items = getAllSitemapItems([
    {
      section: true,
      links: [
        {
          name: 'test',
          to: '/',
        },
        {
          page: true,
          name: 'test page',
          to: '/test-page',
          subpage: [
            {
              section: true,
              name: 'test2',
              links: [
                {
                  name: 'test3',
                  to: '/test3',
                },
              ],
            },
          ],
        },
      ],
    },
  ]);

  expect(items).toHaveLength(5);
  expect(items[1].name).toBe('test');
  expect(items[1].to).toBe('/');
  expect(items[2].name).toBe('test page');
});

test('check for the validity of sitemap', () => {
  function checkSitemap(sitemapItem: SitemapItem[]) {
    sitemapItem.map((currentSitemapItem) => {
      if (currentSitemapItem?.section) {
        expect(currentSitemapItem.links).toBeDefined();
        expect(currentSitemapItem.links?.length).toBeGreaterThan(0);
        if (currentSitemapItem.links) checkSitemap(currentSitemapItem.links);
      } else if (currentSitemapItem?.page) {
        expect(currentSitemapItem.subpage).toBeDefined();
        expect(currentSitemapItem.subpage?.length).toBeGreaterThan(0);
        if (currentSitemapItem.subpage) checkSitemap(currentSitemapItem.subpage);
      } else if (currentSitemapItem.name) {
        if (currentSitemapItem.to) {
          expect(currentSitemapItem.to.length).toBeGreaterThan(0);
        } else if (currentSitemapItem.children) {
          expect(currentSitemapItem.children?.length).toBeGreaterThan(0);
          checkSitemap(currentSitemapItem.children);
        } else {
          throw new Error('A sitemap item was found with only a name property.');
        }
      }
    });
  }
  checkSitemap(sitemap as SitemapItem[]);
});

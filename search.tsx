import type { OnSearch } from "rspress/theme";

/**
 * Hide search results linking to 'extension-api-v3' pages
 */
const onSearch: OnSearch = async (query, defaultSearchResult) => {
  for (let i = 0; i < defaultSearchResult.length; i++) {
    let item = defaultSearchResult[i];
    for (let j = 0; j < item.result.length; j++) {
      let resultItem = item.result[j];
      if (resultItem.link.includes("extension-api-v3")) {
        item.result.splice(j, 1);
        j--;
      }
    }
  }

  return [];
};

export { onSearch };

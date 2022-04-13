function createSelectedTag() {
  let selectedTag = { productId: "", tag: 0 };

  return {
    set: (newTag: { productId: string; tag: number }) => {
      selectedTag = newTag;
    },
    clear: () => {
      selectedTag = { productId: "", tag: 0 };
    },
    get: () => {
      return { ...selectedTag };
    },
  };
}

export const selectedTag = createSelectedTag();

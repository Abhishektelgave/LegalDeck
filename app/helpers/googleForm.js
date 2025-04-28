const getIframeUrl = (url) => {
    const extension = url.split('.').pop().toLowerCase();
  
    const imageAndPdf = ['pdf', 'png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp'];
  
    if (imageAndPdf.includes(extension)) {
      return url;
    } else if (['doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx'].includes(extension)) {
      // Use Microsoft Office Online Viewer
      return `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(url)}`;
    } else {
      // Default fallback: open directly
      return url;
    }
  };
  
export default getIframeUrl;
if (!document.querySelector('link[data-np-fa]')) {
  const faCss = document.createElement('link');
  faCss.rel = 'stylesheet';
  faCss.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.1/css/all.min.css';
  faCss.setAttribute('data-np-fa', 'true');
  document.head.appendChild(faCss);
}

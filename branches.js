fetch('branches.json').then(response => {
    return response.json();
  }).then(options => {
    const select = document.getElementById('input1');
    options.forEach(option => {
      select.innerHTML += `<option value="${option}">${option}</option>`;
    });
  })

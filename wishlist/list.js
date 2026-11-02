(function () {
  var token = (location.hash || '').replace(/^#/, '');
  var title = document.getElementById('wl-title');
  var note = document.getElementById('wl-note');
  var list = document.getElementById('wl-list');
  function gone() { title.textContent = 'This wishlist isn’t shared'; note.textContent = 'The link was turned off or changed by its owner.'; }
  if (!/^[0-9a-f]{36}$/.test(token)) { gone(); return; }
  fetch('https://fkmjprakzcvptxwkjfje.supabase.co/functions/v1/wishlist-share', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token: token }) })
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(function (d) {
      if (!d) { gone(); return; }
      title.textContent = d.name ? d.name + '’s wishlist' : 'A wishlist';
      note.textContent = d.items.length ? d.items.length + (d.items.length === 1 ? ' item' : ' items') : 'Nothing on it yet.';
      d.items.forEach(function (it) {
        var li = document.createElement('li');
        if (it.image) { var img = document.createElement('img'); img.src = it.image; img.alt = ''; img.loading = 'lazy'; li.appendChild(img); }
        var box = document.createElement('div');
        var name = document.createElement(it.link ? 'a' : 'span');
        name.textContent = it.name;
        if (it.link) { name.href = it.link; name.rel = 'noopener noreferrer nofollow'; name.target = '_blank'; }
        name.className = 'wl-name';
        box.appendChild(name);
        var meta = [];
        if (it.price != null) { try { meta.push(new Intl.NumberFormat(undefined, { style: 'currency', currency: it.currency || 'USD' }).format(it.price)); } catch (e) { meta.push(String(it.price)); } }
        if (it.store) meta.push(it.store);
        if (meta.length) { var m = document.createElement('p'); m.textContent = meta.join(' · '); box.appendChild(m); }
        li.appendChild(box);
        list.appendChild(li);
      });
    })
    .catch(function () { title.textContent = 'Couldn’t load this wishlist'; note.textContent = 'Please try again in a moment.'; });
})();

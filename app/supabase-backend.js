(function () {
  "use strict";
  var config = window.CORNERS_SUPABASE || {};
  if (!config.url || !config.publishableKey) return;
  var bridge = window.CornersApp;
  var client, user = null, revision = 0, ready = false;
  var pending = new Set();
  function check(result) {
    if (result.error) throw result.error;
    return result.data;
  }
  function field(form, label, type, name, required) {
    var wrap = document.createElement("label");
    wrap.className = "field";
    wrap.textContent = label;
    var input = document.createElement("input");
    input.type = type; input.name = name; input.required = required;
    input.autocomplete = name === "password" ? "current-password" : name;
    if (name === "username") {
      input.pattern = "[a-zA-Z0-9_]{3,30}"; input.maxLength = 30;
      input.title = "3–30 letters (a–z), numbers or underscores";
    }
    if (name === "password") input.minLength = 8;
    wrap.appendChild(input); form.appendChild(wrap);
    return input;
  }
  function button(parent, label, action) {
    var b = document.createElement("button");
    b.className = "btn"; b.type = "button"; b.textContent = label;
    b.addEventListener("click", action); parent.appendChild(b); return b;
  }
  function account() {
    bridge.openSheet(function (box) {
      var heading = document.createElement("h2");
      heading.textContent = user ? "Your account" : "Sign in or create an account";
      box.appendChild(heading);
      var form = document.createElement("form"); form.className = "field";
      box.appendChild(form);
      var username = field(form, "Username", "text", "username", !!user);
      if (user) username.value = bridge.getUsername();
      var email, password;
      if (!user) {
        email = field(form, "Email", "email", "email", true);
        password = field(form, "Password", "password", "password", true);
      }
      var status = document.createElement("p"); status.setAttribute("role", "status");
      box.appendChild(status);
      var busy = false;
      async function run(action) {
        if (busy || !form.reportValidity()) return;
        busy = true; status.textContent = "Please wait…";
        form.querySelectorAll("button").forEach(function (b) { b.disabled = true; });
        try { status.textContent = await action(); }
        catch (e) { status.textContent = e.message || "Could not connect. Please try again."; }
        finally {
          busy = false;
          form.querySelectorAll("button").forEach(function (b) { b.disabled = false; });
        }
      }
      form.addEventListener("submit", function (event) { event.preventDefault(); });
      if (user) {
        button(form, "Save username", function () { run(async function () {
          var id = user.id, name = username.value.trim();
          check(await client.from("profiles").upsert({ id: id, username: name }));
          if (user && user.id === id) bridge.setAccount(name, bridge.getSaved());
          return "Username saved.";
        }); });
        button(form, "Sign out", function () { run(async function () {
          check(await client.auth.signOut()); return "Signed out.";
        }); });
      } else {
        button(form, "Sign in", function () {
          username.required = false;
          run(async function () {
            check(await client.auth.signInWithPassword({ email: email.value.trim(), password: password.value }));
            password.value = ""; return "Signed in. Close this panel to continue.";
          });
        });
        button(form, "Create account", function () {
          username.required = true;
          run(async function () {
            var data = check(await client.auth.signUp({
              email: email.value.trim(), password: password.value,
              options: { data: { username: username.value.trim() },
                emailRedirectTo: new URL("./", location.href).href }
            }));
            password.value = "";
            return data.session ? "Account created." : "Check your email to confirm your account, then sign in. Your username is reserved when your profile is saved.";
          });
        });
      }
    });
  }
  async function sync(session) {
    var version = ++revision;
    user = session ? session.user : null;
    ready = false;
    bridge.setAccount("Guest", []);
    if (!user) { ready = true; return; }
    var id = user.id;
    try {
      var profile = check(await client.from("profiles").select("username").eq("id", id).maybeSingle());
      if (!profile && user.user_metadata && user.user_metadata.username) {
        var name = user.user_metadata.username;
        if (/^[a-zA-Z0-9_]{3,30}$/.test(name)) {
          var inserted = await client.from("profiles").insert({ id: id, username: name }).select("username").single();
          if (!inserted.error) profile = inserted.data;
          else bridge.toast("Choose an available username in Your account.");
        }
      }
      var saved = check(await client.from("saved_places").select("place_id").eq("user_id", id));
      if (revision !== version) return;
      bridge.setAccount(profile ? profile.username : "Student", saved.map(function (s) { return s.place_id; }));
      ready = true;
    } catch (e) {
      if (revision === version) bridge.toast("Account data could not load: " + e.message);
    }
  }
  window.CornersBackend = {
    account: function () { if (client) account(); else bridge.toast("Connecting to Supabase…"); },
    toggleSave: async function (id) {
      if (!client || !ready) { bridge.toast("Please wait for your account to load."); return; }
      if (!user) { account(); return; }
      if (pending.has(id)) return;
      pending.add(id);
      var version = revision, uid = user.id;
      var removing = bridge.getSaved().indexOf(id) !== -1;
      try {
        check(await (removing
          ? client.from("saved_places").delete().eq("user_id", uid).eq("place_id", id)
          : client.from("saved_places").upsert({ user_id: uid, place_id: id }, { onConflict: "user_id,place_id", ignoreDuplicates: true })));
        if (version !== revision) return;
        var ids = bridge.getSaved().filter(function (savedId) { return savedId !== id; });
        if (!removing) ids.push(id);
        bridge.setAccount(bridge.getUsername(), ids);
        bridge.toast(removing ? "Removed from saved" : "Saved to your account");
      } catch (e) { bridge.toast("Could not save: " + e.message); }
      finally { pending.delete(id); }
    }
  };
  bridge.setPlaces([]);
  bridge.setAccount("Guest", []);
  var note = document.querySelector("[data-backend-note]");
  if (note) note.textContent = "Accounts and saved places use Supabase. Other features are still a local demo.";
  var loader = document.createElement("script");
  loader.src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";
  loader.onerror = function () { bridge.toast("Supabase could not load. Check your connection and reload."); };
  loader.onload = async function () {
    try {
      client = window.supabase.createClient(config.url, config.publishableKey);
      client.auth.onAuthStateChange(function (event, session) {
        // Defer database calls until the Auth callback has released its lock.
        setTimeout(function () { sync(session); }, 0);
      });
      var cities = check(await client.from("cities").select("id").eq("slug", "bilbao").single());
      var places = check(await client.from("places").select("*").eq("city_id", cities.id).order("name"));
      bridge.setPlaces(places.map(function (p) {
        return { id: p.id, cat: p.category, t: p.name, m: p.address || "Bilbao",
          tags: p.price_info ? [p.price_info] : [], c: "var(--h2)", about: p.description };
      }));
    } catch (e) { bridge.toast("Supabase could not load: " + e.message); }
  };
  document.head.appendChild(loader);
}());

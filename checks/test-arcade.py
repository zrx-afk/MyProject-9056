from playwright.sync_api import sync_playwright
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/google-chrome',headless=True,args=['--no-sandbox'])
 page=b.new_page(viewport={'width':1440,'height':1000});errors=[];page.on('pageerror',lambda e:errors.append(str(e)));page.goto('http://localhost:4200');page.wait_for_selector('.library-card');page.add_style_tag(content='html{scroll-behavior:auto!important}*{animation:none!important;transition:none!important}')
 def choose(name):
  page.get_by_role('button',name=f'Play {name}',exact=True).evaluate('(e)=>e.click()');page.wait_for_timeout(70)
 assert page.locator('.library-card').count()==16
 choose('Connect Four');page.get_by_role('button',name='New game').click()
 for c in [1,2,1,2,1,2,1]:page.get_by_role('button',name=f'Drop in column {c}').click()
 assert 'Lime wins' in page.locator('.game-status').inner_text()
 choose('Hangman');page.get_by_role('button',name='New game').click();page.get_by_role('button',name='A',exact=True).click();assert page.get_by_role('button',name='A',exact=True).is_disabled()
 choose('Sliding puzzle');page.get_by_role('button',name='New game').click();blank=page.locator('.sliding-board .blank').evaluate('(e)=>Array.from(e.parentNode.children).indexOf(e)');page.locator('.sliding-board button').nth(blank-1 if blank%4 else blank+1).click();assert '1 moves' in page.locator('.pill').inner_text()
 choose('Simon Says');page.get_by_role('button',name='Start sequence').click();page.wait_for_timeout(450);name=page.locator('.simon-pad.lit').get_attribute('aria-label');page.wait_for_timeout(800);page.get_by_role('button',name=name,exact=True).click();assert 'Round 2' in page.locator('.pill').inner_text()
 choose('Whack-a-mole');page.get_by_role('button',name='Start whacking').click();page.locator('.mole-hole.up').click();assert '1 hits' in page.locator('.pill').inner_text()
 choose('Reaction time');page.locator('.reaction-zone').click();page.locator('.reaction-zone').click();assert page.locator('.reaction-early').is_visible();page.locator('.reaction-zone').click();page.wait_for_selector('.reaction-go',timeout=6000);page.locator('.reaction-zone').click();assert 'ms' in page.locator('.reaction-result').inner_text()
 choose('Pong');page.get_by_role('button',name='Start match').click();page.wait_for_timeout(200);page.keyboard.press('ArrowDown');page.get_by_role('button',name='Pause',exact=True).click();assert page.get_by_role('button',name='Play',exact=True).is_visible()
 choose('Orbit Hopper');page.get_by_role('button',name='Boost / flap').click();page.wait_for_timeout(200);page.get_by_role('button',name='Pause',exact=True).click()
 choose('Tic-Tac-Toe');page.get_by_role('button',name='New game').click()
 for i in [1,4,2,5,3]:page.get_by_role('button',name=f'Cell {i}, empty',exact=True).click()
 assert 'X wins' in page.locator('.game-status').inner_text()
 choose('2048');page.get_by_role('button',name='New game').click();page.keyboard.press('ArrowLeft');page.keyboard.press('ArrowDown');assert page.locator('.tile').count()==16
 page.get_by_role('textbox',name='Search games').fill('snake');assert page.locator('.library-card').count()==1;page.get_by_role('textbox',name='Search games').fill('nothingmatches');assert page.locator('.empty-library').is_visible();page.get_by_role('button',name='Show all games').click()
 page.get_by_role('button',name='Favorite Connect Four',exact=True).click();page.get_by_role('button',name='Favorites',exact=True).click();assert page.get_by_role('button',name='Play Connect Four').is_visible();page.get_by_role('button',name='All games',exact=True).click()
 page.get_by_role('button',name='Enter focus mode').click();assert not page.locator('.library-section').is_visible();page.get_by_role('button',name='Exit focus mode').click()
 page.get_by_role('button',name='How to play').click();assert page.locator('dialog').is_visible();page.keyboard.press('Escape');assert not page.locator('dialog').count()
 page.reload();page.wait_for_selector('.library-card');assert page.get_by_role('button',name='Unfavorite Connect Four').is_visible()
 touch=b.new_context(viewport={'width':390,'height':844},has_touch=True);mobile=touch.new_page();mobile.goto('http://localhost:4200');mobile.wait_for_selector('.connect-board');mobile.add_style_tag(content='html{scroll-behavior:auto!important}*{animation:none!important}');mobile.get_by_role('button',name='Drop in column 1').tap();assert mobile.locator('.connect-hole.disc-1').count()==1
 mobile.get_by_role('button',name='Play Whack-a-mole').evaluate('(e)=>e.click()');mobile.wait_for_timeout(80);mobile.get_by_role('button',name='Start whacking').tap();mobile.locator('.mole-hole.up').tap();assert '1 hits' in mobile.locator('.pill').inner_text()
 assert not errors,errors
 print('PASS: eight new games, 2048/Tic-Tac-Toe regressions, search, empty states, favorites persistence, focus, instructions and touch gameplay. No browser errors.')
 b.close()

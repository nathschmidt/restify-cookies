/**
 *
 * Tests for Restify cookies
 * 
 */
var testutils = require('./testutils');
var expect = require('expect.js');

describe('Testing Restify Cookies', function() {
	var PORT = 25000;

	// Before each test setup a new http server.
	beforeEach(function(done){
		var self = this;

		self.testSever = testutils.server(PORT, done);
	});

	it('should checks our cookies interface is attached', function(done) {
		var self = this;

		self.testSever.get('/', function(req, res){

			expect(req.cookies).to.be.an('object');
			expect(res.setCookie).to.be.a('function');

			res.send('Done');
			done();
		});

		testutils.request.fireAndForget(PORT, function(err){
			if(err){
				done(err);
			}
		});
	});

	describe('Test setting cookies', function() {

		describe('Set a single cookie', function() {
			it('should set a cookie in the response', function(done) {
				var self = this;

				self.testSever.get('/', function(req, res, next){
					// Set a cookie val
					
					res.setCookie('hello', 'world');

					res.send('Hello');
					next();
				});

				testutils.request.fireForCookies(PORT, function(err, cookies){
					if(err){
						done(err);
						return;
					}

					try{
						expect(cookies).to.have.keys('hello');
						expect(cookies['hello']).to.be.eql('world');

					} catch(err){
						done(err);
						return;
					}

					done(err);
				});
			});
		});

		describe('Set multiple cookies', function() {
			it('should set three different cookies in a single handler', function(done) {
				var self = this;

				self.testSever.get('/', function(req, res, next){
					// Set a cookie val
					
					res.setCookie('hello', 'world');
					res.setCookie('welcome', 'home');
					res.setCookie('goodbye', 'sunshine');

					res.send('Hello');
					next();
				});

				testutils.request.fireForCookies(PORT, function(err, cookies){
					if(err){
						done(err);
						return;
					}

					try{

						expect(cookies).to.have.keys('hello', 'welcome', 'goodbye');
						expect(cookies['hello']).to.be.eql('world');
						expect(cookies['welcome']).to.be.eql('home');
						expect(cookies['goodbye']).to.be.eql('sunshine');

					} catch(err){
						done(err);
						return;
					}

					done();
				});				
			});

			it('should set three different cookies in three different handlers', function(done) {
				var self = this;

				self.testSever.use(function(req, res, next){
					// Set a cookie val
					res.setCookie('hello', 'world');

					next();
				});

				self.testSever.get('/', function(req, res, next){
					// Set a cookie val
					res.setCookie('welcome', 'home');
					next('slash2');
				});

				self.testSever.get({path: '/:id', name:'slash2'}, function(req, res, next){
					// Set a cookie val
					res.setCookie('goodbye', 'sunshine');
					res.send('Hello');
					next();
				});

				testutils.request.fireForCookies(PORT, function(err, cookies){
					if(err){
						done(err);
						return;
					}

					try {
						expect(cookies).to.have.keys('hello', 'welcome', 'goodbye');

						expect(cookies['hello']).to.be.eql('world');
						expect(cookies['welcome']).to.be.eql('home');
						expect(cookies['goodbye']).to.be.eql('sunshine');

					} catch(err){
						done(err);
						return;
					}

					done();
				});				
			});
		});

	});

	describe('Test Reading cookies', function() {
		
		it('should read sent cookies', function(done) {
			var self = this;

			self.testSever.get('/', function(req, res, next){

				expect(req).to.have.keys('cookies');
				expect(req.cookies).to.have.keys('hello', 'welcome', 'goodbye');

				var cookies = req.cookies;
				expect(cookies['hello']).to.be.eql('world');
				expect(cookies['welcome']).to.be.eql('home');
				expect(cookies['goodbye']).to.be.eql('sunshine');				

				res.send('Hello');

				next();
				done();
			});

			var cookies = {
				'hello': 'world',
				'welcome': 'home',
				'goodbye': 'sunshine'
			};

			testutils.request.fireWithCookies(PORT, cookies, function(err){
				if(err){
					done(err);
				}
			});			
		});
	});

	describe('Test clearing cookies', function() {

		describe('Clear a single cookie', function() {
			it('should remove a cookie in the response', function(done) {
				var self = this;

				self.testSever.get('/', function(req, res, next){
					expect(req).to.have.keys('cookies');
					expect(req.cookies).to.have.keys('hello', 'welcome');

					var cookies = req.cookies;
					expect(cookies['hello']).to.be.eql('world');
					expect(cookies['welcome']).to.be.eql('home');

					res.clearCookie('hello');

					res.send('Hello');
					next();
				});

				var cookiesToSend = {
					hello: 'world',
					'welcome': 'home'
				};

				testutils.request.fireWithCookies(PORT, cookiesToSend, function(err, cookies){
					if(err){
						done(err);
						return;
					}

					try{
						expect(cookies).to.have.keys('hello');
						expect(cookies['hello']).to.be.eql('');

					} catch(err){
						done(err);
						return;
					}

					done(err);
				});
			});
		});

	});

	afterEach(function(){
		var self = this;

		self.testSever.close();
	});

});
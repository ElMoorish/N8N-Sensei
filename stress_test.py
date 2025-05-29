#!/usr/bin/env python3
"""
N8N-Sensei Infrastructure Stress Testing Suite
Comprehensive testing for performance, security, and reliability
"""

import asyncio
import aiohttp
import time
import json
import random
import string
from concurrent.futures import ThreadPoolExecutor
from typing import List, Dict, Any
import statistics

# Test Configuration
BASE_URL = "https://work-1-fvksntcpqkrdugzj.prod-runtime.all-hands.dev"
CONCURRENT_USERS = 20
REQUESTS_PER_USER = 10
TEST_DURATION = 60  # seconds

class StressTester:
    def __init__(self):
        self.results = {
            'health_checks': [],
            'auth_tests': [],
            'ai_requests': [],
            'workflow_requests': [],
            'errors': [],
            'response_times': []
        }
        self.tokens = []
    
    def generate_random_email(self) -> str:
        """Generate random email for testing"""
        username = ''.join(random.choices(string.ascii_lowercase, k=8))
        return f"{username}@stresstest.com"
    
    def generate_random_password(self) -> str:
        """Generate random password for testing"""
        return ''.join(random.choices(string.ascii_letters + string.digits, k=12))
    
    async def health_check_stress(self, session: aiohttp.ClientSession, user_id: int):
        """Stress test health endpoints"""
        endpoints = ['/api/health', '/api/health/n8n', '/api/health/ai']
        
        for i in range(REQUESTS_PER_USER):
            endpoint = random.choice(endpoints)
            start_time = time.time()
            
            try:
                async with session.get(f"{BASE_URL}{endpoint}") as response:
                    response_time = time.time() - start_time
                    self.results['response_times'].append(response_time)
                    
                    result = {
                        'user_id': user_id,
                        'request_id': i,
                        'endpoint': endpoint,
                        'status': response.status,
                        'response_time': response_time,
                        'success': response.status == 200
                    }
                    self.results['health_checks'].append(result)
                    
                    if response.status != 200:
                        self.results['errors'].append({
                            'type': 'health_check_error',
                            'endpoint': endpoint,
                            'status': response.status,
                            'user_id': user_id
                        })
                        
            except Exception as e:
                self.results['errors'].append({
                    'type': 'health_check_exception',
                    'endpoint': endpoint,
                    'error': str(e),
                    'user_id': user_id
                })
            
            # Small delay to simulate realistic usage
            await asyncio.sleep(0.1)
    
    async def auth_stress_test(self, session: aiohttp.ClientSession, user_id: int):
        """Stress test authentication endpoints"""
        email = self.generate_random_email()
        password = self.generate_random_password()
        
        # Test registration
        start_time = time.time()
        try:
            registration_data = {
                "email": email,
                "password": password,
                "full_name": f"Stress Test User {user_id}"
            }
            
            async with session.post(
                f"{BASE_URL}/api/auth/register",
                json=registration_data
            ) as response:
                response_time = time.time() - start_time
                
                result = {
                    'user_id': user_id,
                    'action': 'register',
                    'status': response.status,
                    'response_time': response_time,
                    'success': response.status == 201
                }
                self.results['auth_tests'].append(result)
                
                if response.status == 201:
                    # Test login
                    start_time = time.time()
                    login_data = {
                        "username": email,
                        "password": password
                    }
                    
                    async with session.post(
                        f"{BASE_URL}/api/auth/login",
                        data=login_data
                    ) as login_response:
                        login_time = time.time() - start_time
                        
                        login_result = {
                            'user_id': user_id,
                            'action': 'login',
                            'status': login_response.status,
                            'response_time': login_time,
                            'success': login_response.status == 200
                        }
                        self.results['auth_tests'].append(login_result)
                        
                        if login_response.status == 200:
                            login_data = await login_response.json()
                            token = login_data.get('access_token')
                            if token:
                                self.tokens.append(token)
                                
                                # Test protected endpoint
                                headers = {"Authorization": f"Bearer {token}"}
                                start_time = time.time()
                                
                                async with session.get(
                                    f"{BASE_URL}/api/auth/me",
                                    headers=headers
                                ) as me_response:
                                    me_time = time.time() - start_time
                                    
                                    me_result = {
                                        'user_id': user_id,
                                        'action': 'protected_endpoint',
                                        'status': me_response.status,
                                        'response_time': me_time,
                                        'success': me_response.status == 200
                                    }
                                    self.results['auth_tests'].append(me_result)
                
        except Exception as e:
            self.results['errors'].append({
                'type': 'auth_exception',
                'error': str(e),
                'user_id': user_id
            })
    
    async def ai_stress_test(self, session: aiohttp.ClientSession, user_id: int):
        """Stress test AI endpoints"""
        if not self.tokens:
            return
        
        token = random.choice(self.tokens)
        headers = {"Authorization": f"Bearer {token}"}
        
        # Test AI chat endpoint
        for i in range(5):  # Fewer AI requests due to potential cost
            start_time = time.time()
            
            chat_data = {
                "message": f"Test message {i} from user {user_id}",
                "provider": "ollama",
                "session_id": f"stress_test_{user_id}_{i}"
            }
            
            try:
                async with session.post(
                    f"{BASE_URL}/api/ai/chat",
                    json=chat_data,
                    headers=headers
                ) as response:
                    response_time = time.time() - start_time
                    
                    result = {
                        'user_id': user_id,
                        'request_id': i,
                        'status': response.status,
                        'response_time': response_time,
                        'success': response.status == 200
                    }
                    self.results['ai_requests'].append(result)
                    
                    if response.status != 200:
                        self.results['errors'].append({
                            'type': 'ai_request_error',
                            'status': response.status,
                            'user_id': user_id
                        })
                        
            except Exception as e:
                self.results['errors'].append({
                    'type': 'ai_request_exception',
                    'error': str(e),
                    'user_id': user_id
                })
            
            await asyncio.sleep(0.5)  # Longer delay for AI requests
    
    async def workflow_stress_test(self, session: aiohttp.ClientSession, user_id: int):
        """Stress test workflow endpoints"""
        if not self.tokens:
            return
        
        token = random.choice(self.tokens)
        headers = {"Authorization": f"Bearer {token}"}
        
        # Test workflow listing
        for i in range(3):
            start_time = time.time()
            
            try:
                async with session.get(
                    f"{BASE_URL}/api/workflows/",
                    headers=headers
                ) as response:
                    response_time = time.time() - start_time
                    
                    result = {
                        'user_id': user_id,
                        'request_id': i,
                        'endpoint': 'list_workflows',
                        'status': response.status,
                        'response_time': response_time,
                        'success': response.status in [200, 404]  # 404 is OK if N8N not connected
                    }
                    self.results['workflow_requests'].append(result)
                    
            except Exception as e:
                self.results['errors'].append({
                    'type': 'workflow_exception',
                    'error': str(e),
                    'user_id': user_id
                })
            
            await asyncio.sleep(0.2)
    
    async def run_user_simulation(self, session: aiohttp.ClientSession, user_id: int):
        """Simulate a complete user session"""
        print(f"Starting user {user_id} simulation...")
        
        # Run different test types concurrently for each user
        await asyncio.gather(
            self.health_check_stress(session, user_id),
            self.auth_stress_test(session, user_id),
            return_exceptions=True
        )
        
        # Run AI and workflow tests after auth (need tokens)
        await asyncio.gather(
            self.ai_stress_test(session, user_id),
            self.workflow_stress_test(session, user_id),
            return_exceptions=True
        )
        
        print(f"Completed user {user_id} simulation")
    
    async def run_stress_test(self):
        """Run the complete stress test suite"""
        print(f"🚀 Starting N8N-Sensei Infrastructure Stress Test")
        print(f"📊 Configuration: {CONCURRENT_USERS} users, {REQUESTS_PER_USER} requests each")
        print(f"⏱️  Duration: {TEST_DURATION} seconds")
        print("-" * 60)
        
        start_time = time.time()
        
        # Create session with connection pooling
        connector = aiohttp.TCPConnector(limit=100, limit_per_host=50)
        timeout = aiohttp.ClientTimeout(total=30)
        
        async with aiohttp.ClientSession(
            connector=connector,
            timeout=timeout
        ) as session:
            # Create tasks for all concurrent users
            tasks = [
                self.run_user_simulation(session, user_id)
                for user_id in range(CONCURRENT_USERS)
            ]
            
            # Run all user simulations concurrently
            await asyncio.gather(*tasks, return_exceptions=True)
        
        total_time = time.time() - start_time
        print(f"\n✅ Stress test completed in {total_time:.2f} seconds")
        
        # Generate report
        self.generate_report(total_time)
    
    def generate_report(self, total_time: float):
        """Generate comprehensive test report"""
        print("\n" + "="*60)
        print("📈 N8N-SENSEI INFRASTRUCTURE STRESS TEST REPORT")
        print("="*60)
        
        # Overall statistics
        total_requests = (
            len(self.results['health_checks']) +
            len(self.results['auth_tests']) +
            len(self.results['ai_requests']) +
            len(self.results['workflow_requests'])
        )
        
        print(f"\n🔢 OVERALL STATISTICS:")
        print(f"   Total Requests: {total_requests}")
        print(f"   Total Errors: {len(self.results['errors'])}")
        print(f"   Success Rate: {((total_requests - len(self.results['errors'])) / total_requests * 100):.2f}%")
        print(f"   Test Duration: {total_time:.2f} seconds")
        print(f"   Requests/Second: {total_requests / total_time:.2f}")
        
        # Response time statistics
        if self.results['response_times']:
            response_times = self.results['response_times']
            print(f"\n⏱️  RESPONSE TIME ANALYSIS:")
            print(f"   Average: {statistics.mean(response_times):.3f}s")
            print(f"   Median: {statistics.median(response_times):.3f}s")
            print(f"   Min: {min(response_times):.3f}s")
            print(f"   Max: {max(response_times):.3f}s")
            print(f"   95th Percentile: {sorted(response_times)[int(len(response_times) * 0.95)]:.3f}s")
        
        # Health check results
        health_success = sum(1 for r in self.results['health_checks'] if r['success'])
        health_total = len(self.results['health_checks'])
        print(f"\n🏥 HEALTH CHECK RESULTS:")
        print(f"   Total: {health_total}")
        print(f"   Success: {health_success}")
        print(f"   Success Rate: {(health_success / health_total * 100):.2f}%" if health_total > 0 else "   No tests")
        
        # Authentication results
        auth_success = sum(1 for r in self.results['auth_tests'] if r['success'])
        auth_total = len(self.results['auth_tests'])
        print(f"\n🔐 AUTHENTICATION RESULTS:")
        print(f"   Total: {auth_total}")
        print(f"   Success: {auth_success}")
        print(f"   Success Rate: {(auth_success / auth_total * 100):.2f}%" if auth_total > 0 else "   No tests")
        print(f"   Tokens Generated: {len(self.tokens)}")
        
        # AI request results
        ai_success = sum(1 for r in self.results['ai_requests'] if r['success'])
        ai_total = len(self.results['ai_requests'])
        print(f"\n🤖 AI REQUEST RESULTS:")
        print(f"   Total: {ai_total}")
        print(f"   Success: {ai_success}")
        print(f"   Success Rate: {(ai_success / ai_total * 100):.2f}%" if ai_total > 0 else "   No tests")
        
        # Workflow request results
        workflow_success = sum(1 for r in self.results['workflow_requests'] if r['success'])
        workflow_total = len(self.results['workflow_requests'])
        print(f"\n⚙️  WORKFLOW REQUEST RESULTS:")
        print(f"   Total: {workflow_total}")
        print(f"   Success: {workflow_success}")
        print(f"   Success Rate: {(workflow_success / workflow_total * 100):.2f}%" if workflow_total > 0 else "   No tests")
        
        # Error analysis
        if self.results['errors']:
            print(f"\n❌ ERROR ANALYSIS:")
            error_types = {}
            for error in self.results['errors']:
                error_type = error.get('type', 'unknown')
                error_types[error_type] = error_types.get(error_type, 0) + 1
            
            for error_type, count in error_types.items():
                print(f"   {error_type}: {count}")
        
        # Performance assessment
        print(f"\n🎯 PERFORMANCE ASSESSMENT:")
        if total_requests / total_time > 50:
            print("   ✅ EXCELLENT: High throughput achieved")
        elif total_requests / total_time > 20:
            print("   ✅ GOOD: Acceptable throughput")
        else:
            print("   ⚠️  NEEDS IMPROVEMENT: Low throughput")
        
        if len(self.results['errors']) / total_requests < 0.01:
            print("   ✅ EXCELLENT: Very low error rate")
        elif len(self.results['errors']) / total_requests < 0.05:
            print("   ✅ GOOD: Acceptable error rate")
        else:
            print("   ⚠️  NEEDS IMPROVEMENT: High error rate")
        
        avg_response_time = statistics.mean(self.results['response_times']) if self.results['response_times'] else 0
        if avg_response_time < 0.5:
            print("   ✅ EXCELLENT: Fast response times")
        elif avg_response_time < 2.0:
            print("   ✅ GOOD: Acceptable response times")
        else:
            print("   ⚠️  NEEDS IMPROVEMENT: Slow response times")
        
        print("\n" + "="*60)
        print("🏁 STRESS TEST COMPLETE")
        print("="*60)

async def main():
    """Main entry point"""
    tester = StressTester()
    await tester.run_stress_test()

if __name__ == "__main__":
    asyncio.run(main())
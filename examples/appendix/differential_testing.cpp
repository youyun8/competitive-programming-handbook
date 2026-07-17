#include <algorithm>
#include <cassert>
#include <cstdint>
#include <iostream>
#include <random>
#include <vector>

long long brute_force_maximum_subarray(const std::vector<int>& values) {
    long long answer = values.front();
    for (int left = 0; left < static_cast<int>(values.size()); ++left) {
        long long sum = 0;
        for (int right = left; right < static_cast<int>(values.size()); ++right) {
            sum += values[right];
            answer = std::max(answer, sum);
        }
    }
    return answer;
}

long long optimized_maximum_subarray(const std::vector<int>& values) {
    long long ending_here = values.front();
    long long answer = ending_here;
    for (int index = 1; index < static_cast<int>(values.size()); ++index) {
        ending_here = std::max<long long>(values[index], ending_here + values[index]);
        answer = std::max(answer, ending_here);
    }
    return answer;
}

int main(int argument_count, char** argument_values) {
    const std::uint64_t seed =
        argument_count >= 2 ? std::stoull(argument_values[1]) : 20260716;
    std::mt19937_64 random_engine(seed);
    std::uniform_int_distribution<int> size_distribution(1, 30);
    std::uniform_int_distribution<int> value_distribution(-50, 50);

    for (int test_index = 0; test_index < 10000; ++test_index) {
        std::vector<int> values(size_distribution(random_engine));

        for (int& value : values) {
            value = value_distribution(random_engine);
        }

        if (brute_force_maximum_subarray(values) != optimized_maximum_subarray(values)) {
            std::cerr << "Mismatch with seed " << seed << " at test " << test_index << '\n';
            return 1;
        }
    }

    std::cout << "All differential tests passed with seed " << seed << '\n';
}

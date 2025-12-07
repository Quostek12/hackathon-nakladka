import random


_RANDOM_MAX_VALUE: int = 40

def random_num_gen() -> int:
    return random.randint(0, _RANDOM_MAX_VALUE)